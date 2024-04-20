listBook = [];
const RENDER_EVENT = 'render-todo';
const SAVE_CONTEN = 'save-conten';
const STORRAGE_KEY = 'BOOK_SHELVING';

function lockData (){
  const parsed = JSON.stringify(listBook);
  localStorage.setItem(STORRAGE_KEY, parsed);
  document.dispatchEvent(new Event(SAVE_CONTEN));
}

function movingdataFromStorage (){
  const listOfData = localStorage.getItem(STORRAGE_KEY);
  let data = JSON.parse(listOfData);

  if (data !== null){
    for( const book of data){
      listBook.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById ('inputBook');
    submitForm.addEventListener('submit', function (event){
    event.preventDefault ();
    addBook();
    });
    movingdataFromStorage();
})

const addBook = () => {
    const nameBook = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').valueAsNumber;
    const isfinished = document.getElementById('inputBookIsComplete').checked;
    
    
    const generatedID = generateId();
    const bookObject = generatedBookObject(generatedID, nameBook, author, year, isfinished);
    listBook.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    lockData();
}

function generateId() {
    return +new Date();
  }
   
function generatedBookObject(id, title, author, year, isCompleted, isfinished) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
      isfinished
    
    
    }
  }

function booksRead (generatedBookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = generatedBookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${generatedBookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun :  ${generatedBookObject.year}`;

    const buttonAction = document.createElement('div');
    buttonAction.classList.add('action');

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(bookTitle, textAuthor, textYear, buttonAction);
    textContainer.setAttribute('id', `book-${generatedBookObject.id}`)

    if (generatedBookObject.isCompleted){
      const completedButton = document.createElement('button');
      completedButton.classList.add('green');
      completedButton.innerText = 'Belum selesai dibaca';

      completedButton.addEventListener('click', function () 
      {
        yetRead(generatedBookObject.id)        
      });
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function (){
      removeBook(generatedBookObject.id);

      })
     buttonAction.append(completedButton, trashButton);
    } else {
      const completedButton = document.createElement('button');
      completedButton.classList.add('green');
      completedButton.innerText = 'Selesai dibaca';

      completedButton.addEventListener('click', function () 
      {
        completeRead(generatedBookObject.id)        
      });
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function (){
      removeBook(generatedBookObject.id);

      })
     buttonAction.append(completedButton, trashButton);

    }

    

    return textContainer;


}



function completeRead (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  lockData();
}

function findBook (bookId){

  for ( const bookItem of listBook){
    if (bookItem.id === bookId )

    return bookItem;
  }
  return null;

}

function removeBook(bookId) {
  const bookTarget = findBookId(bookId);
 
  if (bookTarget === -1) return;
 
  listBook.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  lockData();
}

function findBookId (bookId) {
  for ( const index in listBook){
    if (listBook[index].id === bookId){
      return index;
    }
  }
  return -1;
}




function yetRead (bookId) {

  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  lockData();

}


document.addEventListener(RENDER_EVENT, function () {
 

   const readingBook = document.getElementById('incompleteBookshelfList')
   readingBook.innerHTML = '';

   const doneRead = document.getElementById('completeBookshelfList');
   doneRead.innerHTML = '';


   for (const books of listBook ){                                                                                                                                                                                                                                                                                                                                                                  
    const booksElement = booksRead(books);
    if ( !books.isfinished && !books.isCompleted || books.isCompleted )
    {readingBook.append(booksElement)
      
      if (books.isCompleted){
        doneRead.append(booksElement) 
      }
     
    } else if  ( books.isCompleted || books.isfinished && !books.isCompleted  )
    {doneRead.append(booksElement);
      if (!books.isCompleted){
        readingBook.append(booksElement) 
      }
  }
  
  }
   
   
    

   
  })