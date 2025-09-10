import API from "../utils/axiosInstance";

const fetchApi = async (url) => {
    try {
        const response = await API.get(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        return response;
    } catch (error) {
        console.log("Error :",error)
    }
}

export default fetchApi