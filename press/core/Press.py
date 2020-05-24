from collections import defaultdict, Counter
from .stopwords import UKRAINIAN
from .stemming import stem
import re

def words_steam_cleaner(first_list):
    return Counter([stem(word) for word in first_list if word not in UKRAINIAN])


def text_preprocess(text):
    """
    Tokenize text into words(tokens)
    and clean them from punctuation marks and stopwords
    """

    # Get list of sentences
    tokened_sentences = re.split(r'(?<=[.?!])\s*(?=[—А-ЯA-Z0-9ЇЄҐ])', text.replace('\n', ' '))
    # tokened_sentences = sent_tokenize(text)
    # Compile pattern to find words in string
    word_finding_pattern = re.compile(r"\w+['-]?\w+")

    # Get list of stemmed and cleaned from stopwords sentences
    sentences_with_word_frequency = [words_steam_cleaner(re.findall(word_finding_pattern, sentence.lower()))
                                     for sentence in tokened_sentences]

    # Get list of cleaned from stopwords words
    cleaned_and_stemmed_words = []
    for sentence in sentences_with_word_frequency:
        cleaned_and_stemmed_words += sentence.keys()

    return cleaned_and_stemmed_words, sentences_with_word_frequency, tokened_sentences


def word_evaluation(words):

    """Construct a frequency distribution of words"""
    words_count_dictionary = Counter(words)
    dict_length = len(words_count_dictionary)
    number_of_important_words = max(min(20, dict_length), dict_length // 25)
    most_valuable_words = [word for word, word_count in words_count_dictionary.most_common(number_of_important_words)]
    return most_valuable_words


def find_most_relevant_sentences(main_tokens, stemmed_sentences):

    """Evaluation of sentences and finding most valuable"""

    sentence_ranking = defaultdict(int)
    for i, sentence in enumerate(stemmed_sentences):
        sentence_ranking[i] = sum([occurrence for word, occurrence in sentence.items() if word in main_tokens])
    sentence_ranking = sorted(sentence_ranking, key=sentence_ranking.get, reverse=True)
    return sentence_ranking


def Press(text_to_press, number_of_sentences_to_output, **kwargs):
    """Main function to call"""
    number_of_words_before = len(text_to_press.split())
    stemmed_tokens, stemmed_sentences, tokened_sentences = text_preprocess(text_to_press)
    main_tokens = word_evaluation(stemmed_tokens)

    most_relevant_sentence_indexes = find_most_relevant_sentences(main_tokens, stemmed_sentences)

    sentence_indexes_to_output = sorted(most_relevant_sentence_indexes[:number_of_sentences_to_output])

    sentences_to_output = {index: sentense for index, sentense in enumerate(tokened_sentences)}
    return sentences_to_output, sentence_indexes_to_output


# res = Press(open("Harri.txt").read(), 10)
# print("\n\n".join([res[0][id] for id in res[1]]))

