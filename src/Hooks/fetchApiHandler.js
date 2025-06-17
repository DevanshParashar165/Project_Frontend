import axios from "axios";

const fetchApi = async (url) => {
    try {
        const response = await axios.get(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
        return response;
    } catch (error) {
        console.log("Error :",error)
    }
}

export default fetchApi