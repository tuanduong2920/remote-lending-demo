<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-2xl w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Thông tin vay vốn
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Xác nhận thông tin và điền thông tin vay vốn
        </p>
      </div>

      <!-- User Information Display -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Thông tin cá nhân
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Họ và tên</label
            >
            <p class="mt-1 text-sm text-gray-900">{{ userData.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Số điện thoại</label
            >
            <p class="mt-1 text-sm text-gray-900">{{ userData.phone }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Số căn cước công dân</label
            >
            <p class="mt-1 text-sm text-gray-900">{{ userData.idCard }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500"
              >Ngày sinh</label
            >
            <p class="mt-1 text-sm text-gray-900">
              {{ formatDate(userData.birthDate) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loan Information Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Thông tin vay vốn
        </h3>
        <form @submit.prevent="handleComplete" class="space-y-4">
          <div>
            <label
              for="loanAmount"
              class="block text-sm font-medium text-gray-700"
            >
              Số tiền muốn vay (VNĐ) *
            </label>
            <input
              id="loanAmount"
              v-model="loanForm.amount"
              type="number"
              required
              min="1000000"
              max="1000000000"
              step="100000"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập số tiền muốn vay"
              :class="{ 'border-red-500': errors.amount }"
            />
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
              {{ errors.amount }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              Tối thiểu: 1,000,000 VNĐ - Tối đa: 1,000,000,000 VNĐ
            </p>
          </div>

          <div>
            <label
              for="loanTerm"
              class="block text-sm font-medium text-gray-700"
            >
              Kỳ hạn vay (tháng) *
            </label>
            <select
              id="loanTerm"
              v-model="loanForm.term"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-500': errors.term }"
            >
              <option value="">Chọn kỳ hạn</option>
              <option value="6">6 tháng</option>
              <option value="12">12 tháng</option>
              <option value="18">18 tháng</option>
              <option value="24">24 tháng</option>
              <option value="36">36 tháng</option>
              <option value="48">48 tháng</option>
              <option value="60">60 tháng</option>
            </select>
            <p v-if="errors.term" class="mt-1 text-sm text-red-600">
              {{ errors.term }}
            </p>
          </div>

          <!-- Monthly Payment Estimate -->
          <div v-if="monthlyPayment" class="bg-blue-50 p-4 rounded-md">
            <p class="text-sm text-blue-800">
              <strong>Ước tính trả hàng tháng:</strong>
              {{ formatCurrency(monthlyPayment) }} VNĐ
            </p>
            <p class="text-xs text-blue-600 mt-1">
              *Lãi suất ước tính 12%/năm, chỉ mang tính chất tham khảo
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              @click="handlePrevious"
              class="flex-1 group relative flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Quay lại
            </button>
            <button
              type="submit"
              class="flex-1 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isLoanFormValid"
            >
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

interface UserData {
  name: string;
  phone: string;
  idCard: string;
  birthDate: string;
}

interface LoanForm {
  amount: string;
  term: string;
}

interface LoanErrors {
  amount?: string;
  term?: string;
}

const router = useRouter();

const userData = ref<UserData>({
  name: "",
  phone: "",
  idCard: "",
  birthDate: "",
});

const loanForm = ref<LoanForm>({
  amount: "",
  term: "",
});

const errors = ref<LoanErrors>({});

onMounted(() => {
  // Load user data from localStorage
  const savedData = localStorage.getItem("lendingUserData");
  if (savedData) {
    userData.value = JSON.parse(savedData);
  } else {
    // If no data found, redirect back to init
    router.push("/lending/init");
  }

  // Load existing loan data if available
  const savedLoanData = localStorage.getItem("lendingLoanData");
  if (savedLoanData) {
    loanForm.value = JSON.parse(savedLoanData);
  }
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const monthlyPayment = computed(() => {
  if (!loanForm.value.amount || !loanForm.value.term) return 0;

  const principal = parseFloat(loanForm.value.amount);
  const months = parseInt(loanForm.value.term);
  const monthlyRate = 0.12 / 12; // 12% annual rate

  // Calculate monthly payment using loan formula
  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment);
});

const validateLoanForm = (): boolean => {
  errors.value = {};

  // Validate amount
  const amount = parseFloat(loanForm.value.amount);
  if (!loanForm.value.amount) {
    errors.value.amount = "Số tiền vay là bắt buộc";
  } else if (isNaN(amount)) {
    errors.value.amount = "Số tiền vay phải là số";
  } else if (amount < 1000000) {
    errors.value.amount = "Số tiền vay tối thiểu là 1,000,000 VNĐ";
  } else if (amount > 1000000000) {
    errors.value.amount = "Số tiền vay tối đa là 1,000,000,000 VNĐ";
  }

  // Validate term
  if (!loanForm.value.term) {
    errors.value.term = "Kỳ hạn vay là bắt buộc";
  }

  return Object.keys(errors.value).length === 0;
};

const isLoanFormValid = computed(() => {
  return loanForm.value.amount && loanForm.value.term;
});

const handlePrevious = () => {
  // Save current loan data before going back
  localStorage.setItem("lendingLoanData", JSON.stringify(loanForm.value));
  router.push({ name: "LendingInit" });
};

const handleComplete = () => {
  if (validateLoanForm()) {
    // Combine all data
    const completeData = {
      personalInfo: userData.value,
      loanInfo: {
        amount: parseFloat(loanForm.value.amount),
        term: parseInt(loanForm.value.term),
        estimatedMonthlyPayment: monthlyPayment.value,
      },
      submittedAt: new Date().toISOString(),
    };

    // Log all information
    console.log("=== LENDING APPLICATION COMPLETED ===");
    console.log("Personal Information:", completeData.personalInfo);
    console.log("Loan Information:", completeData.loanInfo);
    console.log("Submitted At:", completeData.submittedAt);
    console.log("=====================================");

    // Clean up localStorage
    localStorage.removeItem("lendingUserData");
    localStorage.removeItem("lendingLoanData");

    // Show success message (you could replace this with a success page)
    alert(
      "Đăng ký vay vốn thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
    );

    // Optionally redirect to home or another page
  }
};
</script>
