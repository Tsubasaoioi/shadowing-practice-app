import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

const ShadowingApp = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [japaneseTranslation, setJapaneseTranslation] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const current = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        setCurrentTime(current);
        setProgress((current / duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    } else {
      alert('有効な動画ファイルを選択してください。');
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const rewind = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime -= seconds;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">シャドーイング練習アプリ</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* 左側: 動画とコントロール */}
        <div className="md:w-1/2">
          <Input 
            type="file" 
            accept="video/*" 
            onChange={handleFileUpload} 
            ref={fileInputRef}
            className="mb-2"
          />
          {videoSrc ? (
            <video ref={videoRef} className="w-full mb-2" controls>
              <source src={videoSrc} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
          ) : (
            <div className="bg-gray-200 w-full h-48 flex items-center justify-center text-gray-500 mb-2">
              動画をアップロードしてください
            </div>
          )}
          
          <div className="mb-2">
            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm mt-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button onClick={togglePlay} className="w-full sm:w-auto">
              {isPlaying ? '一時停止' : '再生'}
            </Button>
            <Button onClick={() => rewind(5)} className="w-full sm:w-auto">5秒戻す</Button>
            <Button onClick={() => rewind(3)} className="w-full sm:w-auto">3秒戻す</Button>
            <Button onClick={() => rewind(1)} className="w-full sm:w-auto">1秒戻す</Button>
          </div>

          <div>
            <label className="block mb-2 font-bold text-sm sm:text-base">現在の文字起こし:</label>
            <p className="bg-gray-100 p-2 rounded">{currentTranscript}</p>
          </div>
        </div>

        {/* 右側: 文字起こしと翻訳 */}
        <div className="md:w-1/2 space-y-4">
          <div>
            <label className="block mb-2 font-bold text-sm sm:text-base">文字起こし（編集可能）:</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="ここに文字起こしを入力してください"
              className="w-full h-40 sm:h-48"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-bold text-sm sm:text-base">日本語訳:</label>
            <Textarea
              value={japaneseTranslation}
              onChange={(e) => setJapaneseTranslation(e.target.value)}
              placeholder="ここに日本語訳を入力してください"
              className="w-full h-40 sm:h-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadowingApp;