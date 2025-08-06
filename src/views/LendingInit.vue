<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Thông tin cá nhân
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Vui lòng điền đầy đủ thông tin để tiếp tục
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleNext">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Họ và tên *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập họ và tên"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Số điện thoại *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập số điện thoại"
              :class="{ 'border-red-500': errors.phone }"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label for="idCard" class="block text-sm font-medium text-gray-700">
              Số căn cước công dân *
            </label>
            <input
              id="idCard"
              v-model="form.idCard"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập số căn cước công dân"
              :class="{ 'border-red-500': errors.idCard }"
            />
            <p v-if="errors.idCard" class="mt-1 text-sm text-red-600">{{ errors.idCard }}</p>
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700">
              Ngày sinh *
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.birthDate }"
            />
            <p v-if="errors.birthDate" class="mt-1 text-sm text-red-600">{{ errors.birthDate }}</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isFormValid"
          >
            Tiếp theo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface UserForm {
  name: string
  phone: string
  idCard: string
  birthDate: string
}

interface FormErrors {
  name?: string
  phone?: string
  idCard?: string
  birthDate?: string
}

const router = useRouter()

const form = ref<UserForm>({
  name: '',
  phone: '',
  idCard: '',
  birthDate: ''
})

const errors = ref<FormErrors>({})

// Load existing data from localStorage if available
const savedData = localStorage.getItem('lendingUserData')
if (savedData) {
  form.value = JSON.parse(savedData)
}

const validateForm = (): boolean => {
  errors.value = {}

  // Validate name
  if (!form.value.name.trim()) {
    errors.value.name = 'Họ và tên là bắt buộc'
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'Họ và tên phải có ít nhất 2 ký tự'
  }

  // Validate phone
  const phoneRegex = /^[0-9]{10,11}$/
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Số điện thoại là bắt buộc'
  } else if (!phoneRegex.test(form.value.phone.replace(/\s/g, ''))) {
    errors.value.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)'
  }

  // Validate ID card
  const idCardRegex = /^[0-9]{9,12}$/
  if (!form.value.idCard.trim()) {
    errors.value.idCard = 'Số căn cước công dân là bắt buộc'
  } else if (!idCardRegex.test(form.value.idCard.replace(/\s/g, ''))) {
    errors.value.idCard = 'Số căn cước công dân không hợp lệ (9-12 chữ số)'
  }

  // Validate birth date
  if (!form.value.birthDate) {
    errors.value.birthDate = 'Ngày sinh là bắt buộc'
  } else {
    const today = new Date()
    const birthDate = new Date(form.value.birthDate)
    const age = today.getFullYear() - birthDate.getFullYear()
    
    if (age < 18) {
      errors.value.birthDate = 'Bạn phải từ 18 tuổi trở lên'
    } else if (age > 100) {
      errors.value.birthDate = 'Ngày sinh không hợp lệ'
    }
  }

  return Object.keys(errors.value).length === 0
}

const isFormValid = computed(() => {
  return form.value.name.trim() && 
         form.value.phone.trim() && 
         form.value.idCard.trim() && 
         form.value.birthDate
})

const handleNext = () => {
  if (validateForm()) {
    // Save data to localStorage
    localStorage.setItem('lendingUserData', JSON.stringify(form.value))
    
    // Navigate to complete step
    router.push({ name: "LendingComplete" });
  }
}
</script> 