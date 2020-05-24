import tensorflow as tf
import pickle
from model import Model
import numpy as np
from nltk.tokenize import word_tokenize



class Summarizer:

    def __init__(self):

        with open("dumps/args.pickle", "rb") as f:
            self.args = pickle.load(f)
        self.word_dict, self.reversed_dict, self.article_max_len, self.summary_max_len = self.build_dict()
        self.model = Model(self.reversed_dict, self.article_max_len, self.summary_max_len, self.args, forward_only=True)
        self.sess=tf.Session()  
        self.saver = tf.train.Saver(tf.global_variables())
        self.ckpt = tf.train.get_checkpoint_state("./saved_model/")
        self.saver.restore(self.sess, self.ckpt.model_checkpoint_path)

    
    def predict(self, text):
        X = self.build_dataset(text)
        batch_x_len = [len([y for y in x if y != 0]) for x in X]
        valid_feed_dict = {
            self.model.batch_size: len(X),
            self.model.X: X,
            self.model.X_len: batch_x_len,
        }
        prediction = self.sess.run(self.model.prediction, feed_dict=valid_feed_dict)
        prediction_output = [[self.reversed_dict[y] for y in x] for x in prediction[:, 0, :]]
        return "\n".join([" ".join([word for word in sent_output if word != '</s>']) for sent_output in prediction_output])


    def build_dict(self):
        with open("dumps/word_dict.pickle", "rb") as f:
            word_dict = pickle.load(f)
        reversed_dict = dict(zip(word_dict.values(), word_dict.keys()))
        article_max_len = 200
        summary_max_len = 25
        return word_dict, reversed_dict, article_max_len, summary_max_len


    def build_dataset(self, text):
        x = [d for d in self.get_two_hundrets(word_tokenize(text))]
        x = [[self.word_dict.get(w, self.word_dict["<unk>"]) for w in d] for d in x]
        x = [d[:self.article_max_len] for d in x]
        x = [d + (self.article_max_len - len(d)) * [self.word_dict["<padding>"]] for d in x]
        return np.array(x)[:8]

    def get_two_hundrets(self, text):
        for i in range(len(text)//200+1):
            yield text[i*200: i*200+200]