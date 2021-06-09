import FetchService from '@/services/Fetch.service.js';

const Fetch = new FetchService();

export default class UserService {
    async delUser(id) {
        try {
            let res = await (await Fetch.deleteFetch(`http://localhost:3000/users/remove/${id}`)).json();
            return res;
        } catch (error) {
            return { statusCode: 500, message: error.message };
        }
    }

    async saveUser(user, file_img) {
        try {
            let formData = new FormData();
            formData.append("file", file_img);
            formData.append("oldImg", user.avatar);
            let res = await (await Fetch.postFetch("http://localhost:3000/image/upload", formData, {})).json();
            if (res.statusCode == 200) user.avatar = res.data.avatar;

            res = await (await Fetch.postFetch("http://localhost:3000/api/user/add", JSON.stringify({user}))).json();
            return res;
        } catch (error) {
            console.log(error.message);
            return { statusCode: 500, message: error.message }
        }
    }

    async updateUser(user, file_img) {
       try {
           let formData = new FormData();
           formData.append("file", file_img);
           formData.append("oldImg", user.avatar);
           let res = await (await Fetch.postFetch("http://localhost:3000/image/upload", formData, {})).json();
           if (res.statusCode == 200) user.avatar = res.data.avatar;
           res = await (await Fetch.patchFetch(`http://localhost:3000/api/user/update/${user.id}`, JSON.stringify({ user }))).json();
           return res;
       } catch (error) {
           console.log(error.message);
           return { statusCode: 500, message: error.message }
       }
    }
}