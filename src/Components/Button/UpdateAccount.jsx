import React, { useState } from 'react';

function UpdateAccount({ setActiveForm }) {
  const [selectionForm, setSelectionForm] = useState(false);

  return (
    <div>
      <div className="flex justify-evenly mt-6">
        <button
          className="mt-3 p-4 bg-green-700 text-xl rounded-4xl cursor-pointer hover:bg-green-800"
          onClick={() => setSelectionForm(!selectionForm)}
        >
          Update Account
        </button>
      </div>

      {selectionForm && (
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold mb-2">Select the Field You want to update</h1>

          <button
            className="bg-green-600 rounded-4xl w-70 px-6 mt-3 mx-6 hover:bg-green-800"
            onClick={() => setActiveForm('fullname')}
          >
            Fullname And Email
          </button><br />


          <button
            className="bg-green-600 rounded-4xl w-70 px-6 mt-3 mx-6 hover:bg-green-800"
            onClick={() => setActiveForm('avatar')}
          >
            Avatar
          </button><br />

          <button
            className="bg-green-600 rounded-4xl w-70 px-6 mt-3 mx-6 hover:bg-green-800"
            onClick={() => setActiveForm('cover')}
          >
            Cover Image
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdateAccount;
