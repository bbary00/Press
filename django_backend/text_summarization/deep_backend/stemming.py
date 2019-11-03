import re
import time
from pprint import pprint as pp
from string import punctuation

"""
This module user for cutting ukrainian words (stemming) by Porter algorithm
see info: http://irbis-nbuv.gov.ua/cgi-bin/irbis_nbuv/
          cgiirbis_64.exe?C21COM=2&I21DBN=UJRN&P21DBN=UJRN
          &IMAGE_FILE_DOWNLOAD=1&Image_file_name=PDF/Npdntu_inf_2017_1_10.pdf 
To see it in work uncomment all lines in a "stem" function and paste
a name of .txt file in <FILE.TXT> place.
"""

# Dictionary with suffixes
ends = {
    'prefixes': r'^(без|по-|екс-|премєр-|від'
                r'|од|пере|між|над|об|пре|перед|під|понад'
                r'|пред|роз|через|при|прі|архі|із|зі|без|роз|через|по|за|най)',
    'adverb': r'(учи|ючи|ачи|ячи|ши|ив|ів|[иі]?вши(сь)?)$',
    'infinitive': r'([тс][яь])$',
    'adjective': r'(ими|(н|ин|ичн|ист|ічн|їн'
                 r'|їст|їчн|ев|єв|ов|уват|куват|юват|оват'
                 r'|овит|анн|енн)?(их|ий|ій|им|а|е|ої|ого|ими))$',
    'participle': r'(ий|ого|ому|им|ім|ою|ій|их|йми|их|ан)$',
    'verb': r'([еєиї]+ш|[еєиї]+(мо)|[аяиїую]ть|ла|ло|ов|ив|ав|али|вши|ме|ти)$',
    'noun': r'([еє](ві|ні|нем|нами)|[еє][юйм]|[ая](ми|ти|ті|та|тами)'
            r'|[ая][мх]|о[юмк]|ові|їв|ів|а|ев|ов|еи|и|й|о|у|ь|я|і|ї|є|е|ю)$',
    'vowel': r'[аеиоуюяіїє]',
    'vowel_end': r'[аеиоуюяіїєь]$'
}


def ukstemmer_search_preprocess(word):

    """Text pre-process"""

    word = word.replace("'", "")
    return word


def cut(st_part, reg):

    """Find the biggest suffix in a given suffix group and cut it"""

    rex = re.compile(reg)
    found_suffixes = rex.findall(st_part)
    if found_suffixes:
        if type(found_suffixes[0]) is tuple:
            found_suffixes = list(found_suffixes[0])
        length = [len(suf) for suf in found_suffixes]
        reg = found_suffixes[length.index(max(length))]
        suff_possition = st_part.rfind(reg)
        return st_part[:suff_possition]
    return st_part


def stemming(word):

    """
    Check whether we can stem the word
    and find part from stemming by
    looking for first vowel.
    """

    word = ukstemmer_search_preprocess(word)
    if not re.search(ends['vowel'], word):
        return word
    p = re.search(ends['vowel'], word)
    first_part = word[0:p.span()[1]]
    last_part = word[p.span()[1]:]
    return first_phase(first_part, last_part, word)


def first_phase(start, end, word):

    """
    Try cutting suffix from -end
    by finding it in different parts of speech.
    Return new -end immediately after cutting.
    """

    try_cut = cut(end, '[іи]сть$')
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    try_cut = cut(end, ends['adverb'])
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    try_cut = cut(end, ends['infinitive'])
    if end != try_cut:
        end = try_cut
        end = cut(end, ends['verb'])
        return second_phase(start, end, word)

    try_cut = cut(end, ends['adjective'])
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    try_cut = cut(end, ends['participle'])
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    try_cut = cut(end, ends['verb'])
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    try_cut = cut(end, ends['noun'])
    if end != try_cut:
        end = try_cut
        return second_phase(start, end, word)

    return second_phase(start, end, word)


def second_phase(start, end, word):

    """
    Cut the rest of suffixes.
    Try to cut prefix.
    """

    cut(end, ends['vowel_end'])
    end = re.sub(r'нн', 'н', end)
    if len(start + end) < 3:
        return word
    stem = start + end
    stem_without_prefix = re.sub(ends['prefixes'], '', stem)
    if len(stem_without_prefix) > 2:
        stem = stem_without_prefix
    return stem


def get_cleaned_words(text):
    """Tokenize text into words(tokens)
     and clean them from punctuation marks and stopwords"""

    with open('stopwords/ukrainian.txt', 'r') as f:
        f.readline()
        stopwords = f.read().split()
    with open('stopwords/punct.txt', 'r') as f:
        f.readline()
        punct = f.read().split()
    punct += list(punctuation)
    stopwords = set(stopwords + punct)
    from nltk.tokenize import word_tokenize
    tokened_words = word_tokenize(text)
    cleaned_words = []
    for word in tokened_words:
        if word not in stopwords and word[0] not in punct and word[-1] \
                not in punct:
            cleaned_words.append(word)
    return cleaned_words


def stem(word):
    # with open("Harri.txt", encoding='utf-8', errors='ignore') as f:
    #     text = f.read()
    # words = get_cleaned_words(text)
    #
    # st = time.time()
    # d = {}
    # st_words = []
    # for i in range(len(words)):
    #     st_words.append(stemming(words[i]))
    # for i in st_words:
    #     d[i] = []
    # for i in range(len(words)):
    #     target = stemming(words[i])
    #     if target in d.keys() and words[i] not in d[target]:
    #         d[target].append(words[i])
    # d = sorted(d.items(), key=lambda x: len(x[1]))
    # pp(d)
    # end = time.time()
    # print("Work was done for {} sec".format(end-st))
    # print("Len words: {}".format(len(words)))
    # print("Unique words: {}".format(len(list(set(words)))))
    # print('Len after stemming: {}'.format(len(list(set(st_words)))))
    return stemming(word)
