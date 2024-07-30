from moviepy.editor import VideoFileClip
import whisper
import nltk
import random
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.tokenize.treebank import TreebankWordDetokenizer

nltk.download('punkt')
nltk.download('stopwords')

##########################
### GENERATE TRANSCRIPT ###
 ###########################

def extract_audio(video_path, audio_path):
    print("Converting Video to Audio File")
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)
    print("Video to Audio Conversion Completed")

def transcribe_audio_with_whisper(audio_path, text_path):
    print("Converting Audio to Text")
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    print("Audio to Text Conversion Completed. Text is saved in", text_path)
    with open(text_path, 'w') as f:
        f.write(result['text'])
    return result['text']

# Example usage:
video_path = "E:\\Projects\\VideoToText\\storytest2.mp4"
audio_path = "E:\\Projects\\VideoToText\\audio.wav"
text_path = "E:\\Projects\\VideoToText\\transcription.txt"

extract_audio(video_path, audio_path)
transcribed_text = transcribe_audio_with_whisper(audio_path, text_path)
print(transcribed_text)

#######################
#### GENERATE QUIZ #####
 ########################

def read_text_file(text_file_path):
    with open(text_file_path, 'r') as file:
        text = file.read()
    return text

def generate_quiz(text, num_questions=5):
    sentences = sent_tokenize(text)
    stop_words = set(stopwords.words('english'))
    questions = []

    for sentence in sentences:
        words = word_tokenize(sentence)
        filtered_words = [word for word in words if word.isalnum() and word.lower() not in stop_words]

        if len(filtered_words) < 5:
            continue

        fdist = FreqDist(filtered_words)
        common_words = fdist.most_common(5)

        for word, _ in common_words:
            question = sentence.replace(word, '')
            options = [word]
            while len(options) < 4:
                option = random.choice(filtered_words)
                if option not in options:
                    options.append(option)
            random.shuffle(options)

            questions.append({
                'question': question,
                'options': options,
                'answer': word
            })

            if len(questions) >= num_questions:
                return questions

    return questions

def save_quiz_to_file(quiz, output_file_path):
    with open(output_file_path, 'w') as file:
        for i, q in enumerate(quiz, 1):
            file.write(f"Q{i}: {q['question']}\n")
            for j, option in enumerate(q['options'], 1):
                file.write(f"{chr(64+j)}. {option}\n")
            file.write(f"Answer: {q['answer']}\n\n")

# Example usage:
text_path = "E:\\Projects\\VideoToText\\transcription.txt"
output_file_path = "E:\\Projects\\VideoToText\\quiz.txt"

text_content = read_text_file(text_path)
quiz = generate_quiz(text_content, num_questions=5)
save_quiz_to_file(quiz, output_file_path)

print("Quiz generated and saved to file.")