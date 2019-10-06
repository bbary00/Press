from string import punctuation
from langdetect import detect
from .stemming import stem


def get_sent(text):
    """Tokenizing text into sentences."""
    import nltk
    nltk.download('punkt')
    from nltk.tokenize import sent_tokenize
    sentences = sent_tokenize(text)
    return sentences


def get_cleaned_words(text):
    """Tokenize text into words(tokens)
     and clean them from punctuation marks and stopwords"""

    try:
        lang = detect(str(text))
    except Exception:
        lang = 'uk'
    if lang == 'uk':
        with open('test_summarization/stopwords/ukrainian.txt', 'r') as f:
            f.readline()
            stop_words = f.read().split()
    else:
        with open('test_summarization/stopwords/english.txt', 'r') as f:
            stop_words = f.read().split()
    with open('test_summarization/stopwords/punct.txt', 'r') as f:
        f.readline()
        punct = f.read().split()
    punct += list(punctuation)
    stopwords = set(stop_words + punct)
    cleaned_words = []
    stemmed_sent = []
    from nltk.tokenize import word_tokenize
    for sent in text:
        sent_list = []
        token_sent = word_tokenize(sent.lower())
        for word in token_sent:
            if word not in stopwords and word[0] not in punct and word[-1] \
                    not in punct:
                stemmed = stem(word)
                cleaned_words.append(stemmed)
                sent_list.append(stemmed)
        stemmed_sent.append(sent_list)
    return [cleaned_words, stemmed_sent]


def word_evaluation(words):

    """Construct a frequency distribution of words"""

    from collections import Counter
    d = dict(sorted(dict(Counter(words)).items(), key=lambda x: x[1],
                    reverse=True))
    n = list(d.keys())
    k_words = max(min(20, len(n)), len(n) // 100)
    return n[:k_words]


def finding_sent(freq, sent):

    """Evaluation of sentences and finding most valuable"""

    from collections import defaultdict
    ranking = defaultdict(int)
    for i in range(len(sent)):
        for w in sent[i]:
            if w.lower() in freq:
                ranking[i] += 1
    ranking = sorted(ranking.items(), key=lambda x: x[1], reverse=True)
    ranking = [i[0] for i in ranking]
    return ranking


def summarize(data, sent, perc):

    """Main function to call"""

    token_sentences = get_sent(data)
    tokens, stemmed_sent = get_cleaned_words(token_sentences)
    main_tokens = word_evaluation(tokens)
    ranking = finding_sent(main_tokens, stemmed_sent)
    try:
        if not perc:
            n = int(sent)
            s_idx = ranking[:n]
            summary = [token_sentences[i] for i in sorted(s_idx)]
        else:
            p = int(perc)
            p = max(1, len(token_sentences) * p // 100)
            s_idx_p = ranking[:p]
            summary = [token_sentences[j] for j in sorted(s_idx_p)]
        # s = '\n'.join(summary)
    except Exception:
        return ''
    return summary

