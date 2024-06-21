import { Client } from "@opensearch-project/opensearch";

const PushToOpenSearch =  async (title, description, author, videoUrl) => {
   try {

       // Process video upload and extract metadata
       var host = process.env.OPEN_SEARCH_HOST;
      
       var client = new Client({
           node: host
       });

       var index_name = "video";
       var document = {
           title: title,
           author: author,
           description: description,
           videoUrl: videoUrl
       };

       var response = await client.index({
           id: title, // id should ideally be db id
           index: index_name,
           body: document,
           refresh: true,
       });
      
   } catch (error) {
       // Respond with error message
       console.log(error.message)
   }
};
export default PushToOpenSearch;