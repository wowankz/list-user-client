<template>
	<v-container>
		<v-row class="d-flex justify-center">
			<v-col cols="12" md="8" lg="8" sm="10" class="d-flex justify-end align-center">
				<v-col cols="12" md="3" lg="3" sm="3">
					<v-select dense v-model="img_sort_item" :items="img_sort_items" label="Sort by image" outlined></v-select>
				</v-col>
			</v-col>
		</v-row>
		<v-row v-if="users.length > 0" class="d-flex flex-column align-content-center mt-0 pb-5">
			<v-col cols="12" md="8" lg="8" sm="10" class="d-flex flex-column">
				<UserItem v-for="(user, i) in userList" :key="i" :user="user" @editUser="editUser" @delUser="delUser"></UserItem>
			</v-col>

			<v-col cols="12" md="8" lg="8" sm="10" class="d-flex flex-column">
				<v-btn @click="addUser()" color="primary" elevation="2" large>Add user</v-btn>
			</v-col>
		</v-row>

		<v-row v-else
			><v-col cols="6" offset="3" class="my-9"><v-progress-linear indeterminate color="teal" height="10"></v-progress-linear></v-col>
		</v-row>

		<!-- Modal edid add user -->
		<template v-if="isOpenModalEditUser">
			<EditUser
				@cancel="isOpenModalEditUser = false"
				@update="updateUsers"
				@setTitle="title_modal = $evet"
				v-model="edit_user"
				:UserService="UserService"
				:isEdit="isOpenModalEditUser"
				:title="title_modal"
			/>
		</template>
	</v-container>
</template>

<script>
	import EditUser from '@/components/Modals/EditUser.vue';
	import FetchService from '@/services/Fetch.service.js';
	import UserItem from '@/components/UserItem/Item.vue';
	import NewUser from './NewUser.js';
	import UserService from '@/services/User.service.js';
	const Fetch = new FetchService();
	export default {
		name: 'ListUser',
		components: { UserItem, EditUser },

		data: () => ({
			users: [],
			edit_user: {},
			title_modal: 'ADD',
			isOpenModalEditUser: false,
			UserService: new UserService(),
			img_sort_item: 'All',
			img_sort_items: ['All', 'With image', 'No image'],
		}),

		computed: {
			userList() {
				let users = [];
				if (this.img_sort_item == 'All') users = this.users;
				if (this.img_sort_item == 'With image') users = this.users.filter((user) => user.avatar);
				if (this.img_sort_item == 'No image') users = this.users.filter((user) => !user.avatar);
				return users;
			},
		},

		methods: {
			addUser() {
				console.log('Add new User');
				this.edit_user = new NewUser();
				this.isOpenModalEditUser = true;
			},

			editUser(id) {
				console.log('Edit user id : ', id);
				this.title_modal = 'Edit User';
				this.edit_user = this.users.find((user) => user.id == id);
				this.isOpenModalEditUser = true;
			},

			async delUser(id) {
				console.log('Delete user id: ', id);
				try {
					let res = await Fetch.deleteFetch(`http://localhost:3000/api/user/remove/${id}`);
					res = await res.json();
					if (res.statusCode == 200) {
						const index = this.users.findIndex((user) => user.id == res.data.id);
						this.users.splice(index, 1);
					} else {
						console.log('Fetch delete user error : ', res.message);
					}
				} catch (error) {
					console.log(error.message);
				}
			},

			async getUsers() {
				const url = 'http://localhost:3000/api/users';
				try {
					const list = await Fetch.getFetch(url);
					this.users = await list.json();
				} catch (error) {
					console.error(`GET : ${url}  ${error.message}`);
					this.users = [];
				}
			},

			updateUsers(id) {
				console.log('Update users');
				const index = this.users.findIndex((user) => user.id == id);
				if (index != -1) this.users[index] = this.edit_user;
				else this.users.push(this.edit_user);
				this.isOpenModalEditUser = false;
			},
		},

		async mounted() {
			this.getUsers();
		},
	};
</script>
