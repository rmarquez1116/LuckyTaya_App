'use client'
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaWifi, FaVolumeUp, FaUserCog, FaLock, FaFileUpload } from 'react-icons/fa';
import MainLayout from '../layout/mainLayout';
import BalanceHeader from '../components/balanceHeader';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';
import ConfirmationModal from '../components/confirmationModal';
import axios from 'axios';
import { useProfileContext } from '../context/profileContext';


export default function UploadId() {
  const { profile } = useProfileContext();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false)
  const [image, setImage] = useState(null); // State to hold the image URL
  const [alert, setAlert] = useState({ isAnimating: false, timeout: 3000, isOpen: false, message: "", type: "success" })
  const [isLoading, setIsLoading] = useState(false)
  // Handle the file input change

  useEffect(() => {
    if (profile)
      setImage(profile.id)
    return () => {

    }
  }, [profile])

  const handleFileChange = (event) => {
    const fle = event.target.files[0]; // Get the actual file object
    if (fle) {
      const previewUrl = URL.createObjectURL(fle); // Create an object URL to preview the image
      setImage(previewUrl); // Set the image URL to the state
      setFile(fle); // Save the file itself in the state (for upload)
    }
  };

  const [file, setFile] = useState(null);

  // Handle the image upload logic (e.g., sending it to a server)
  const handleUpload = async () => {
    if (!file) {
      setAlert({
        isAnimating: false,
        timeout: 3000,
        isShow: true,
        message: "Please select an image first!",
        type: "success"
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file); // Append the actual file here, not the preview URL

    try {
      // const response = await fetch('/api/uploadImage', {
      //   method: 'POST',
      //   body: formData,
      // });
      const response = await axios.post('/api/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let message = "Image successfully uploaded. Please wait while we check your registration.";
      if (response.status != 200) {
        message = "Image cannot be uploaded. Please try again later";
      }

      setIsSuccess(response.status == 200)
      setAlert({
        isAnimating: false,
        timeout: 3000,
        isShow: true,
        message: message,
        type: "success"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setAlert({
        isAnimating: false,
        timeout: 3000,
        isShow: true,
        message: "An error occurred while uploading the image.",
        type: "error"
      });
    }

    setIsLoading(false);
  };
  const onConfirm = () => {
    setAlert({
      isAnimating: false,
      timeout: 3000, isShow: false, message: "",
      type: "success"
    })
    if (isSuccess) { router.replace('/profile_menu') }
  }
  return (
    <MainLayout>
      <BalanceHeader type={1} />
      <ConfirmationModal
        isOpen={alert.isShow}
        isOkOnly={true}
        onConfirm={onConfirm}
        message={alert.message}
      ></ConfirmationModal>
      <div className="w-full mt-5 card max-w-sm mx-auto  p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-center">Upload ID</h2>
        {profile && (profile.status ?? "").toLowerCase() != 'approved' &&
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
          />
        }

        {image && (
          <div className="flex justify-center mt-4">
            <img src={image} alt="Preview" className="w-48 h-48 object-cover rounded-md" />
          </div>
        )}
        {profile && (profile.status?? "").toLowerCase() != 'approved' &&

          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              className="mt-4 primary text-white px-6 py-2 rounded-md"
            >
              Upload Image
            </button>
          </div>
        }
      </div>
      {isLoading && <Loading />}
    </MainLayout>
  );
}