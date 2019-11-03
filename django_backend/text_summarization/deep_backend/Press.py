from collections import defaultdict
from .stopwords import UKRAINIAN
from collections import Counter
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
    tokened_sentences = re.split(r'(?<=[.?!])\s*(?=[—А-ЯA-Z0-9])', text.replace('\n', ' '))
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


def create_groups(sent_indexes, max_value=20000):
    sent_indexes[0] = 0
    sent_indexes[-1] = 20000
    sent_indexes[3] = 2
    print('main sents: ', sent_indexes)
    context_indexes = []
    for i in sent_indexes:
        context_indexes += list(range(max(0, i-2), min(i+2, max_value) + 1))
    context_indexes = sorted(set(context_indexes))
    from itertools import groupby, cycle
    x2 = cycle(context_indexes)
    next(x2)
    grps = groupby(context_indexes, key=lambda j: j + 1 == next(x2))
    for k, v in grps:
        if k:
            print(tuple(v) + (next((next(grps)[1])),))


def Press(text_to_press, number_of_sentences_to_output, **kwargs):
    """Main function to call"""
    stemmed_tokens, stemmed_sentences, tokened_sentences = text_preprocess(text_to_press)
    main_tokens = word_evaluation(stemmed_tokens)

    most_relevant_sentence_indexes = find_most_relevant_sentences(main_tokens, stemmed_sentences)
    sentence_indexes_to_output = most_relevant_sentence_indexes[:number_of_sentences_to_output]

    sentences_to_output = [tokened_sentences[index] for index in sorted(sentence_indexes_to_output)]
    return sentences_to_output
