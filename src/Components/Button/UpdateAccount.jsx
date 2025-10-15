import React, { useState } from 'react';

function UpdateAccount({ setActiveForm }) {
  const [selectionForm, setSelectionForm] = useState(false);

  return (
    <div className="text-center">
      <button
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => setSelectionForm(!selectionForm)}
      >
        ⚙️ Update Account
      </button>

      {selectionForm && (
        <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-6 text-white">Select what to update</h3>

          <div className="space-y-3">
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white rounded-xl hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
              onClick={() => setActiveForm('fullname')}
            >
              👤 Update Name & Email
            </button>

            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white rounded-xl hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
              onClick={() => setActiveForm('avatar')}
            >
              🖼️ Update Profile Picture
            </button>

            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 text-white rounded-xl hover:bg-gradient-to-r hover:from-green-500/30 hover:to-teal-500/30 transition-all"
              onClick={() => setActiveForm('cover')}
            >
              🌄 Update Cover Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateAccount;