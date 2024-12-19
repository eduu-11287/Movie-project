let api = 'cf5d0a76';
let moviels = document.getElementById("list-movies");
let searchBox = document.getElementById("search-box");
let searchBtn = document.getElementById("search-btn");
let favoritels = document.getElementById("favorite-ls");
let favSearbox = document.getElementById("favourite-srbx")
let favSearBx = document.getElementById("favorite-btn");

let favorite = JSON.parse(localStorage.getItem('favorite')) || [];

function movieFavorite(searchFav =favorite ) {
    favoritels.innerHTML = ' ';
    searchFav.forEach((movie, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <span id="m-title${index}">${movie.Title}</span>
            <input type="text" id="editedtl${index}" value="${movie.Title}" style="display: none";/>
            <div class="moviebtcont">
            <button onclick="edit(${index})">Edit</button>
            <button onclick="editSave(${index})" id="savebtn">Save</button>
            <button onclick="deleteFav(${index})">Delete</button>
            </div>
        `;
        favoritels.appendChild(li);
    });
}


function edit(index) {
    document.getElementById(`m-title${index}`).style.display ="none";
    document.getElementById(`editedtl${index}`).style.display ="block";
    document.getElementById(`savebtn${index}`).style.display ="inline-block";

}

function editSave(index){
    let newTitle = document.getElementById(`editedtl${index}`).value;
    if(newTitle){
        favorite[index].Title = newTitle;
    localStorage.setItem(`favorite`, JSON.stringify(favorite));
    movieFavorite();
    alert("Item saved");
    }
}  

function deleteFav(index){
    let remove = confirm("Are you sure you want todelet");
    if(remove) {
        favorite.splice(index, 1);
        localStorage.setItem(`favorite`, JSON.stringify(favorite));
        movieFavorite();
        alert("Deleted");
    }else{
        alert("Record not deleted");
    }
}

function searchFavorites(query){
    let found = favorite.filter(movies => 
    movies.Title.toLowerCase().includes(query.toLowerCase()));
    if(found.length > 0){
    movieFavorite(found);
    }else{
        alert("No movie found");
    }
}

function newMovies(movies){
    moviels.innerHTML = '';
    movies.forEach(movie => {
        let card = document.createElement('div');
        card.className = 'card-movie';
        let img =movie.Poster !== "N/A"  && `<img src="${movie.Poster}" alt="${movie.Title}">`;
        card.innerHTML = `${img}<h3>${movie.Title}</h3><p>${movie.Year}</p><button onclick="addToFav('${movie.imdbID}')">Add to Favorite</button>`;
        moviels.appendChild(card);
    });
}

function addToFav(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${api}`).then(response => response.json())
        .then(movie => {
            if(!favorite.some(favr => favr.imdbID === imdbID)){
                favorite.push(movie);
                localStorage.setItem('favorite',JSON.stringify(favorite));
                movieFavorite();
                alert("Movie add to favorites");
            }
        })
}    

function searchMovie(query){
    let url = `https://www.omdbapi.com/?s=${query}&apikey=${api}`;
    fetch(url).then(response => response.json())
        .then(data => {
            if(data.Response === 'True'){
                newMovies(data.Search);
            }else{
                alert("No movies found please again");
            }
        });
}

searchBtn.addEventListener( 'click', () => {
    let query = searchBox.value.trim();
    searchMovie(query);

});

favSearBx.addEventListener('click', () => {

    let query = favSearbox.value.trim();
    searchFavorites(query)
});

movieFavorite();