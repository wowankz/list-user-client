<template>
	<v-dialog persistent width="500" v-model="isEdit" dark>
		<v-card class="py-3 pt-0 px-3" :loading="isProgressSaveUser" loader-height="10">
			<v-card-title class="blue--text text-uppercase">{{ title }}</v-card-title>

			<v-form ref="form" v-model="valid" lazy-validation class="mt-5">
				<v-row class="d-flex justify-center">
					<v-list-item-avatar width="12vw" height="12vw" class="border" color="grey lighten-4">
						<v-img v-if="imgPrev" :src="getImg(imgPrev)" contain></v-img>
						<v-icon v-else size="80">mdi-account</v-icon>
					</v-list-item-avatar>
				</v-row>

				<v-file-input
					@change="onFileChange"
					@click:clear="clearImg"
					:rules="imgRules"
					show-size
					accept="image/png, image/jpeg, image/bmp"
					placeholder="Pick an avatar"
					prepend-icon="mdi-camera"
					label="Avatar"
				></v-file-input>

				<v-text-field
					outlined
					v-model="modelValue.f_name"
					:counter="10"
					:rules="nameFirstRules"
					label="First Name"
					required
				></v-text-field>

				<v-text-field
					outlined
					v-model="modelValue.s_name"
					:counter="10"
					:rules="nameLastRules"
					label="Last Name"
					required
				></v-text-field>

				<v-text-field
					outlined
					:error="!!email_error"
					:error-messages="email_error"
					v-model="modelValue.email"
					:rules="emailRules"
					label="E-mail"
					required
					prepend-inner-icon="mdi-email"
				></v-text-field>

				<v-text-field
					outlined
					v-model="modelValue.phone"
					:rules="phoneRules"
					label="Phone"
					:counter="12"
					required
					prepend-inner-icon="mdi-phone-plus"
				></v-text-field>
			</v-form>

			<div class="d-flex justify-end mt-5" width="100%">
				<v-btn @click="cancel()" color="purple" class="mr-2">Cancel</v-btn>
				<v-btn @click="saveUser()" color="success">Save</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'change',
		},

		props: {
			value: {
				type: Object,
				default: () => {},
			},

			isEdit: {
				type: Boolean,
				default: false,
			},

			title: {
				type: String,
				default: '',
			},

			UserService: {
				type: Object,
			},
		},

		data() {
			return {
				isProgressSaveUser: false,
				imgPrev: '',
				imgFile: null,
				valid: true,
				email_error: '',
				emailRules: [
					(v) => {
						this.email_error = '';
						const re = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
						return re.test(v) || 'Incorrect email';
					},
				],

				phoneRules: [
					(v) => {
						const re = /^\d{11,12}$/;
						return re.test(v) || 'The phone number must have  fewer than 12 digits only';
					},
				],

				nameFirstRules: [
					(v) => {
						return v?.length > 0 || 'The field cannot be empty';
					},
					(v) => {
						return /^[a-zA-Zа-яА-Я]{2,16}$/.test(v) || 'First name must have a letter only';
					},
				],

				nameLastRules: [
					(v) => {
						return v?.length > 0 || 'The field cannot be empty';
					},
					(v) => {
						return /^[a-zA-Zа-яА-Я]{2,16}$/.test(v) || 'Last name must have a letter only';
					},
				],

				imgRules: [(value) => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'],
			};
		},

		computed: {
			modelValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.emit('change', val);
				},
			},
		},

		methods: {
			getImg(avatar) {
				return avatar.includes('http') ? avatar : avatar.includes('base64') ? avatar : `http://localhost:3000/image/${avatar}`;
			},

			clearImg() {
				this.imgPrev = null;
				this.imgFile = null;
			},

			createImage(file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.imgPrev = e.target.result;
					this.imgFile = file;
				};
				reader.readAsDataURL(file);
			},

			onFileChange(file) {
				if (!file) {
					return;
				}
				this.createImage(file);
			},

			cancel() {
				this.$emit('cancel');
			},

			async saveUser() {
				if (!this.$refs['form'].validate()) return;
				let res = null;
				this.isProgressSaveUser = true;
				this.$emit('setTitle ', 'Saving user');
				console.log('Save user: ', this.modelValue.f_name, this.modelValue.s_name);
				if (this.modelValue.id) {
					res = await this.UserService.updateUser(this.modelValue, this.imgFile);
				} else {
					res = await this.UserService.saveUser(this.modelValue, this.imgFile);
				}
				console.log(res);
				if (res.statusCode == 201) {
					this.email_error = '';
					this.isProgressSaveUser = false;
					this.$emit('setTitle ', '');
					this.modelValue.id = res.data.id;
					this.$emit('update', res.data.id);
				}

				if (res.statusCode == 409) {
					this.email_error = res.message;
					this.isProgressSaveUser = false;
					this.$emit('setTitle ', 'Edit user');
				}
			},
		},

		watch: {
			'modelValue.avatar': {
				handler(val) {
					this.imgPrev = val;
				},
			},
		},

		mounted() {
			this.imgPrev = this.modelValue.avatar;
		},
	};
</script>

<style lang="scss" scoped></style>
