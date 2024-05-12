import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';

const storedPlaces = JSON.parse(localStorage.getItem('places')) || [];
// Method One
const myItems = AVAILABLE_PLACES.filter(({ id }) => storedPlaces.includes(id));

// Method Tow
// const my = storedPlaces.map((item) =>
//   AVAILABLE_PLACES.filter(({ id }) => id === item)
// );

function App() {
  const [pickedPlaces, setPickedPlaces] = useState(myItems);
  const [sorter, setSorter] = useState([]);
  const [showModalDialog, setShowModalDialog] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setSorter(sortedPlaces);
    });
  }, []);

  const modal = useRef();
  const selectedPlace = useRef();

  function handleStartRemovePlace(id) {
    setShowModalDialog(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setShowModalDialog(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('places')) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem('places', JSON.stringify([id, ...storedIds]));
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );

    setShowModalDialog(false);

    const storedIds = JSON.parse(localStorage.getItem('places')) || [];
    const filteredIds = storedIds.filter((id) => id !== selectedPlace.current);
    localStorage.setItem('places', JSON.stringify(filteredIds));
  }, []);

  return (
    <>
      <Modal
        open={showModalDialog}
        onClose={handleStopRemovePlace}
      >
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img
          src={logoImg}
          alt='Stylized globe'
        />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title='Available Places'
          places={sorter}
          fallbackText='There are no places available.'
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
