import React, { useContext, useState } from 'react'
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import imageCompression from 'browser-image-compression';
import axios from 'axios';


const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext) 

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = null;

    if (selectedImg) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedImg, options);

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "crushbuzz_upload"); // replace with actual preset

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dlgavezoz/upload", // replace with your cloud name
        formData
      );

      imageUrl = res.data.secure_url;
    }

    // Now send this to your backend
    await updateProfile({
      fullName: name,
      bio,
      profilePic: imageUrl,
    });

    navigate('/');
  } catch (error) {
    console.error("Upload failed", error);
    alert("Image upload failed. Try with a smaller file.");
  }
};

  
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            Upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} 
          type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
           placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>

           <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage