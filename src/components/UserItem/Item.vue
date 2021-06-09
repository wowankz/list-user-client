<template>
	<div class="user">
		<v-card
			@click="editUser(user.id)"
			ripple
			width="100%"
			height="auto"
			elevation="8"
			class="d-flex justify-start pr-3 pt-1 pb-1 pl-1 my-2 user"
		>
			<v-avatar rounded width="80" height="80" class="mr-3">
				<img v-if="user.avatar" :src="getImg(user.avatar)" :alt="user.f_name" />
				<v-icon v-else size="80">mdi-account</v-icon>
			</v-avatar>
			<div class="d-flex flex-column">
				<v-card-title class="py-0 px-0">{{ user.f_name }} {{ user.s_name }}</v-card-title>
				<div class="d-flex">
					<v-icon dense>mdi-email</v-icon>
					<span class="ml-2 subtitle-2">{{ user.email }}</span>
				</div>
				<div class="d-flex">
					<v-icon small>mdi-phone</v-icon>
					<span class="ml-2 subtitle-2">+{{ user.phone }}</span>
				</div>
			</div>
			<v-spacer></v-spacer>
			<v-icon @click.self.stop="delUser(user.id)" large color="red accent-4">mdi-delete</v-icon>
		</v-card>
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},

		data() {
			return {};
		},

		computed: {},

		methods: {
			getImg(avatar) {
				return avatar.includes('http') ? avatar : avatar.includes('base64') ? avatar : `http://localhost:3000/image/${avatar}`;
			},

			async delUser(id) {
				this.$emit('delUser', id);
			},

            async editUser(id){
                this.$emit('editUser', id)
            }
		},

		mounted() {},
	};
</script>

<style lang="scss" scoped></style>
