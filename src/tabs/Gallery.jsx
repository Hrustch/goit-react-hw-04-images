import { useState, useEffect } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Text, PhotosList, Loader, Modal } from 'components';
/* document.addEventListener('click', (event)=>{console.log(event.target)}) */
export const Gallery = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  useEffect(()=>{
    if (query){
      setIsLoading(true)
      ImageService.getImages(query, page)
        .then(({ hits, totalHits }) => {        
          if (!hits.length) {
            setIsEmpty({ isEmpty: true });
            return;
          }
          setPhotos([...photos, ...hits])
          setShowBtn(page < Math.ceil(totalHits / 15))  
        })
        .catch(error => {
          setError(error.message );
        })
        .finally(()=>{
          setIsLoading(false)}         
        )
    }
  },[query, page])




  const onSubmit = (sentQuery) => {
    console.log(sentQuery)
    if (query === sentQuery) {
      return alert('Already shown');
    }
    setQuery(sentQuery);
    setPage(1);
    setPhotos([]);
    setShowBtn(false);
    setIsEmpty(false);
    setError('');
    setSelectedImg('');
  };

  const handleClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImg = (url) => {
    console.log(`handleImg: `,url)
    setSelectedImg(url);
  };

  const handleEscape = () => {
    setSelectedImg('');
  };

  return (
    <>
      <SearchForm onSubmit={onSubmit} />
      {selectedImg && <Modal url={selectedImg} handleEscape={handleEscape}/>}
      {photos.length > 0 && <PhotosList photos={photos} handleImg={handleImg}/>}
      
      {showBtn && <Button onClick={handleClick}>Load more...</Button>}
      {isEmpty && (
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      )}
      {error && <Text textAlign="center">Sorry. {error} ... 😭</Text>}
      {isLoading && <Loader/>}
    </>
  );
}
