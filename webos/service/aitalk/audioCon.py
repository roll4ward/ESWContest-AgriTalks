import numpy as np
import sys

def read_pcm(file_path, dtype=np.int16):
    # Read the raw PCM data from the file
    with open(file_path, 'rb') as f:
        pcm_data = np.frombuffer(f.read(), dtype=dtype)
    return pcm_data

def resample_audio(audio_data, original_rate, target_rate):
    # Calculate the ratio between the original and target sample rate
    ratio = target_rate / original_rate

    # Determine the number of samples for the resampled data
    target_length = int(len(audio_data) * ratio)

    # Create an array of indices for the resampled data
    target_indices = np.linspace(0, len(audio_data) - 1, target_length)

    # Use linear interpolation to fill in the resampled data
    resampled_data = np.interp(target_indices, np.arange(len(audio_data)), audio_data)

    return resampled_data

def save_pcm(file_path, audio_data, dtype=np.int16):
    # Convert to the appropriate data type (e.g., int16 for 16-bit PCM)
    audio_data = audio_data.astype(dtype)

    # Write the data to a new PCM file
    with open(file_path, 'wb') as f:
        f.write(audio_data.tobytes())


if __name__ == "__main__":
    input_file = sys.argv[1]
    input_sr = int(sys.argv[2])
    output_file = sys.argv[3]
    output_sr = int(sys.argv[4])

    audio_data = read_pcm(input_file)
    resampled_audio = resample_audio(audio_data, input_sr, output_sr)
    save_pcm(output_file, resampled_audio)

    print(f"Resampled PCM saved to: {output_file}")