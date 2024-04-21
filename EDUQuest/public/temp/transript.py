# import sys
# import moviepy.editor as mp
# import speech_recognition as sr
# from pydub import AudioSegment
# import os

# # Convert video to audio
# def video_to_audio(video_file):
#     video = mp.VideoFileClip(video_file)
#     audio_file = "temp_audio.wav"
#     video.audio.write_audiofile(audio_file)
#     return audio_file

# # Transcribe audio to text
# def transcribe_audio(audio_file):
#     recognizer = sr.Recognizer()
#     audio = AudioSegment.from_wav(audio_file)
#     chunks = audio[::60000]
#     full_text = ""

#     for i, chunk in enumerate(chunks):
#         chunk_file = f"chunk{i}.wav"
#         chunk.export(chunk_file, format="wav")
#         try:
#             with sr.AudioFile(chunk_file) as source:
#                 audio_listened = recognizer.record(source)
#                 try:
#                     text = recognizer.recognize_google(audio_listened)
#                     full_text += text + " "
#                 except sr.UnknownValueError as e:
#                     print("Error:", str(e))
#         finally:
#             try:
#                 os.remove(chunk_file)  # Clean up chunk file
#             except PermissionError as e:
#                 print(f"Warning: Could not delete {chunk_file} due to a permission error: {e}")
#                 # Optionally, add a delay and retry the deletion if necessary

#     return full_text

# # Main function to process video and generate transcript
# def generate_transcript(video_file):
#     audio_file = video_to_audio(video_file)
#     transcript = transcribe_audio(audio_file)
#     os.remove(audio_file)  # Clean up audio file
#     return transcript



# # Example usage
# video_file_path =  sys.argv[1];
# print("Current Working Directory:", os.getcwd())
# transcript = generate_transcript(video_file_path)
# print(transcript)

print("hello")