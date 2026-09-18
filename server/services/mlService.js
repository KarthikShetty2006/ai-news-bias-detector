import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;
console.log("ML_SERVICE_URL:", process.env.ML_SERVICE_URL);
const mlClient = axios.create({
    baseURL: ML_SERVICE_URL,
    timeout: 15000
});

export const analyzeArticle = async (text) => {


    try {

        const response = await mlClient.post(
            "/predict/analyze",
            {
                text
            }
        );

        return response.data;

    } catch (error) {

        if (error.response) {

            throw new Error(
                `ML Service Error : ${error.response.status}`
            );

        }

        if (error.request) {

            throw new Error(
                "Unable to reach ML Service."
            );

        }

        throw new Error(error.message);
    }

};

/*export const analyzeArticle = async (text) => {

    console.log("================================");
    console.log("Calling ML Service...");
    console.log("URL:", `${ML_SERVICE_URL}/predict/analyze`);
    console.log("Text:", text.substring(0, 100));

    try {

        const response = await mlClient.post("/predict/analyze", {
            text
        });

        console.log("SUCCESS");
        console.log(response.data);

        return response.data;

    } catch (error) {

        console.log("FAILED");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Response:", error.response.data);
        } else if (error.request) {
            console.log("No response received from ML service");
        } else {
            console.log(error.message);
        }

        throw error;
    }

};
*/
export const getAnalyzedArticles = async () => {

  const response = await api.get(
    "predict/analyzed"
  );

  return response.data;
};