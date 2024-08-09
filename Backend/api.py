from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movies = pickle.load(open('movie_list.pkl','rb'))
similarity = pickle.load(open('similarity.pkl','rb'))
movie_list = pd.read_csv('tmdb_5000_movies.csv')[['id','title']]


def recommend(movie):
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    movies_id = []
    for i in distances[1:6]:
        movies_id.append(str(movies.iloc[i[0]].movie_id))

    return movies_id

@app.route('/list', methods=['GET'])
def list_movies():
    return jsonify(movie_list.to_numpy().tolist())

@app.route('/recommend', methods=['GET'])
def recommend_movies():
    movie = request.args.get('movie')
    if movie is None:
        return jsonify({'error': 'No movie title provided'}), 400

    try:
        movie_ids = recommend(movie)
        return jsonify(movie_ids)
    except IndexError:
        return jsonify({'error': 'Movie not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
