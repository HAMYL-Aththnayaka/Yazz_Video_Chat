/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import { PollContext } from './PollContext';
import React, { useContext, useRef, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { useString } from '../utils/useString';
import useRemoteMute, { MUTE_REMOTE_TYPE } from '../utils/useRemoteMute';
import TertiaryButton from '../atoms/TertiaryButton';
import Spacer from '../atoms/Spacer';
import RemoteMutePopup from '../subComponents/RemoteMutePopup';
import TextInput from '../atoms/TextInput';
import ChatContext, { controlMessageEnum } from './ChatContext';

import { calculatePosition, isValidReactComponent } from '../utils/common';
import {
  I18nMuteType,
  peoplePanelMuteAllMicBtnText,
  peoplePanelTurnoffAllCameraBtnText,
} from '../language/default-labels/videoCallScreenLabels';
import { useCustomization } from 'customization-implementation';
//import {controlMessageEnum} from './ChatContext';

export interface MuteAllAudioButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

export const MuteAllAudioButton = (props: MuteAllAudioButtonProps) => {
  const [showAudioMuteModal, setShowAudioMuteModal] = useState(false);
  const audioBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteAudio = useRemoteMute();
  const muteAllAudioButton = useString(peoplePanelMuteAllMicBtnText)();
  const onPressAction = () => muteRemoteAudio(MUTE_REMOTE_TYPE.audio);
  const { width: globalWidth, height: globalHeight } = useWindowDimensions();
  const showAudioModal = () => {
    audioBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: localWidth / 2,
            right: -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowAudioMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showAudioModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.audio}
        actionMenuVisible={showAudioMuteModal}
        setActionMenuVisible={setShowAudioMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowAudioMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (audioBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllAudioButton}
      />
    </>
  );
};

export interface MuteAllVideoButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}
export const MuteAllVideoButton = (props: MuteAllVideoButtonProps) => {

  const [showVideoMuteModal, setShowVideoMuteModal] = useState(false);
  const videoBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteVideo = useRemoteMute();
  const { width: globalWidth, height: globalHeight } = useWindowDimensions();
  const muteAllVideoButton = useString(peoplePanelTurnoffAllCameraBtnText)();
  const onPressAction = () => muteRemoteVideo(MUTE_REMOTE_TYPE.video);
  const showVideoModal = () => {
    videoBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: globalWidth < 720 ? 0 : localWidth / 2,
            right: globalHeight < 720 ? 0 : -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowVideoMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showVideoModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type={I18nMuteType.video}
        actionMenuVisible={showVideoMuteModal}
        setActionMenuVisible={setShowVideoMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowVideoMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (videoBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllVideoButton}
      />
    </>
  );
};

const HostControlView = () => {
  const { AudioControlComponent, VideoControlComponent } = useCustomization(
    data => {
      let components: {
        AudioControlComponent: React.ComponentType;
        VideoControlComponent: React.ComponentType;
      } = {
        AudioControlComponent:
          MuteAllAudioButton as React.ComponentType<MuteAllAudioButtonProps>,
        VideoControlComponent:
          MuteAllVideoButton as React.ComponentType<MuteAllVideoButtonProps>,
      };

      if (
        data?.components?.videoCall?.hostControls?.audioControl &&
        isValidReactComponent(
          data?.components?.videoCall?.hostControls?.audioControl,
        )
      ) {
        components.AudioControlComponent =
          data?.components?.videoCall?.hostControls?.audioControl;
      }

      if (
        data?.components?.videoCall?.hostControls?.videoControl &&
        isValidReactComponent(
          data?.components?.videoCall?.hostControls?.videoControl,
        )
      ) {
        components.VideoControlComponent =
          data?.components?.videoCall?.hostControls?.videoControl;
      }

      return components;
    },
  );
  const { isModelOpen, setIsModelOpen, question, setQuestion, answers, setAnswers } = useContext(PollContext); // destrucutre karaddi {} mpt []

  const chatCtx = useContext(ChatContext);
  const sendControlMessage = chatCtx ? chatCtx.sendControlMessage : null;

  return (
    // <View style={style.container}>
    <>
      <View style={style.mainContainer}>
        {/* Row 1: Mute Controls */}
        <View style={style.controlRow}>
          {!$config.AUDIO_ROOM && (
            <View style={{ flex: 1 }}>
              <VideoControlComponent />
            </View>
          )}
          {!$config.AUDIO_ROOM && <Spacer horizontal size={16} />}
          <View style={{ flex: 1 }}>
            <AudioControlComponent />
          </View>
        </View>

        {/* Row 2: Poll Section */}
        {/* Row 2: Poll Section */}
        <View style={style.pollContainer}>
          <Text style={style.heading}>Create a Poll</Text>

          {/* The Main Question */}
          <TextInput
            style={style.input}
            value={question}
            placeholder={'Type your question here'}
            onChangeText={setQuestion}
            placeholderTextColor={'#ccc'}
          />

          {/* The Options List */}
          {answers.map((ans, index) => (
            <View key={index} style={style.optionWrapper}>
              <TextInput
                style={style.smallInput} // Using the new smaller style
                value={ans.option}
                placeholder={`Option ${index + 1}`}
                onChangeText={text =>
                  setAnswers([
                    ...answers.slice(0, index),
                    { option: text, votes: 0 },
                    ...answers.slice(index + 1),
                  ])
                }
                placeholderTextColor={'#888'}
              />
            </View>
          ))}
        </View>
        <View style={style.btnContainer}>
          <TertiaryButton
            text={'Submit Poll'}
            onPress={() => {
              if (!question.trim()) return;

              setIsModelOpen(true);

              if (sendControlMessage) {
                sendControlMessage(controlMessageEnum.initiatePoll, {
                  question,
                  answers,
                  isNewPoll: true,
                });
              } else {
                console.warn("RTM not ready. Poll not broadcasted.");
              }
            }}
          />
        </View>
      </View>
    </>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pollContainer: {
    marginTop: 10,
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: $config.SECONDARY_ACTION_COLOR,
    marginBottom: 12,
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#444',
    padding: 10,
    borderRadius: 4,
  },
  // NEW STYLES START HERE
  optionWrapper: {
    marginTop: 5,
  },
  smallInput: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  btnContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default HostControlView;
