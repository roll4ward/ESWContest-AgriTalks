import { callService } from './serviceUtils';

/**
 * 저장된 이미지 경로 리스트 전체 쿼리
 * @param {Function} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function readAllImages(callback) {
    callService('infomedia', 'image/readAll', {}, callback);
}

/**
 * 저장된 이미지 경로에 yuv파일을 jpg로 변환
 * @param {Function} callback 쿼리한 결과를 처리할 콜백 함수
 */
export function convertJpg(callback) {
    callService('infomedia', 'image/convertJpg', {}, callback);
}

/**
 * 녹음기 초기화
 * @param {Function} callback 녹음 초기화 결과를 처리할 콜백 함수
 */
export function initRecord(callback) {
    callService('infomedia', 'record/init', {}, callback);
}

/**
 * 녹음 시작
 * @param {string} id 레코더 ID
 * @param {Function} callback 녹음 시작 결과를 처리할 콜백 함수
 */
export function startRecord(id, callback) {
    callService('infomedia', 'record/start', { recorderId: id }, callback);
}

/**
 * 녹음 중단
 * @param {string} id 레코더 ID
 * @param {Function} callback 녹음 중단 결과를 처리할 콜백 함수
 */
export function stopRecord(id, callback) {
    callService('infomedia', 'record/stop', { recorderId: id }, callback);
}