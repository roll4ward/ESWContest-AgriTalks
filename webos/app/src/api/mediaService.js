import { callService } from './serviceUtils';
const APP_URL = 'luna://xyz.rollforward.app';
const WEBOSSERVICE_URL = 'luna://com.webos.service';

// 이미지 관련 서비스 호출 부분
/**
 * 저장된 이미지 경로 리스트 전체 쿼리
 * @param {Function} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readAllImages(callback) {
    callService(APP_URL, 'infomedia', 'image/readAll', {}, callback);
}

/**
 * 저장된 이미지 경로에 yuv파일을 jpg로 변환
 * @param {Function} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function convertJpg(callback) {
    callService(APP_URL, 'infomedia', 'image/convertJpg', {}, callback);
}

/**
 * 녹음 시작
 * @param {Function} callback 녹음 시작 결과를 처리할 콜백 함수
 */
export function startRecord(callback) {
    callService(APP_URL, 'infomedia', 'record/start', {}, callback);
}

/**
 * 녹음 중단
 * @param {string} id 레코더 ID
 * @param {Function} callback 녹음 중단 결과를 처리할 콜백 함수
 */
export function stopRecord(id, callback) {
    callService(APP_URL, 'infomedia', 'record/stop', { recorderId: id }, callback);
}

// 음성파일 관련 서비스 호출 부분
/**
 * 음성파일 재생
 * @param {string} ttsFile ttsFile 위치
 * @param {*} callback 결과를 처리할 콜백 함수
 */

export function audioStart(ttsFile, callback) {
    let query = {
        fileName: ttsFile,
        sink: "default1",
        sampleRate: 32000,
        format: "PA_SAMPLE_S16LE",
        channels: 1
    };
    callService(WEBOSSERVICE_URL, 'audio', 'playSound', query, callback);
}

/**
 * 음성파일 재생
 * @param {string} id 음성파일 playback id
 * @param {*} callback 결과를 처리할 콜백 함수
 */

export function audioStop(id, callback) {
    let query = { playbackId: id, requestType: "stop" };
    callService(WEBOSSERVICE_URL, 'audio', 'controlPlayback', query, callback);
}