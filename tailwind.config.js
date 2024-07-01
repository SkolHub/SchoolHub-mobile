/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './theme/**/*.{js,jsx,ts,tsx}'
  ],
  // presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 'primary-50': 'var(--color-primary-50)',
        // 'primary-100': 'var(--color-primary-100)',
        // 'primary-200': 'var(--color-primary-200)',
        // 'primary-300': 'var(--color-primary-300)',
        // 'primary-400': 'var(--color-primary-400)',
        // 'primary-500': 'var(--color-primary-500)',
        // 'primary-600': 'var(--color-primary-600)',
        // 'primary-700': 'var(--color-primary-700)',
        // 'primary-800': 'var(--color-primary-800)',
        // 'primary-900': 'var(--color-primary-900)',
        // 'primary-950': 'var(--color-primary-950)',
        // 'secondary-50': 'var(--color-secondary-50)',
        // 'secondary-100': 'var(--color-secondary-100)',
        // 'secondary-200': 'var(--color-secondary-200)',
        // 'secondary-300': 'var(--color-secondary-300)',
        // 'secondary-400': 'var(--color-secondary-400)',
        // 'secondary-500': 'var(--color-secondary-500)',
        // 'secondary-600': 'var(--color-secondary-600)',
        // 'secondary-700': 'var(--color-secondary-700)',
        // 'secondary-800': 'var(--color-secondary-800)',
        // 'secondary-900': 'var(--color-secondary-900)',
        // 'secondary-950': 'var(--color-secondary-950)',
        'primary-blue-50': '#f6f7f9',
        'primary-blue-100': '#eceef2',
        'primary-blue-200': '#d5dae2',
        'primary-blue-300': '#b1bbc8',
        'primary-blue-400': '#8696aa',
        'primary-blue-500': '#677990',
        'primary-blue-600': '#526177',
        'primary-blue-700': '#434e61',
        'primary-blue-800': '#3d4756',
        'primary-blue-900': '#343a46',
        'primary-blue-950': '#22272f',
        'secondary-blue-50': '#effaff',
        'secondary-blue-100': '#e3f5ff',
        'secondary-blue-200': '#b8eaff',
        'secondary-blue-300': '#79daff',
        'secondary-blue-400': '#32c8fe',
        'secondary-blue-500': '#07b2f0',
        'secondary-blue-600': '#008fce',
        'secondary-blue-700': '#0072a6',
        'secondary-blue-800': '#036089',
        'secondary-blue-900': '#094f71',
        'secondary-blue-950': '#06324b',
        'primary-green-50': '#f1f8ed',
        'primary-green-100': '#dff0d7',
        'primary-green-200': '#c0e3b3',
        'primary-green-300': '#9acf87',
        'primary-green-400': '#76bb60',
        'primary-green-500': '#599f43',
        'primary-green-600': '#437e32',
        'primary-green-700': '#34612a',
        'primary-green-800': '#2e4e26',
        'primary-green-900': '#263f21',
        'primary-green-950': '#12240f',
        'secondary-green-50': '#effef0',
        'secondary-green-100': '#e3ffe6',
        'secondary-green-200': '#b5fdbd',
        'secondary-green-300': '#7cf98b',
        'secondary-green-400': '#3cec52',
        'secondary-green-500': '#13d42c',
        'secondary-green-600': '#09b01f',
        'secondary-green-700': '#0b8a1c',
        'secondary-green-800': '#0f6c1c',
        'secondary-green-900': '#0e591a',
        'secondary-green-950': '#013209',
        'primary-yellow-50': '#f5f5f1',
        'primary-yellow-100': '#e4e5dc',
        'primary-yellow-200': '#cbccbc',
        'primary-yellow-300': '#aeaf95',
        'primary-yellow-400': '#989777',
        'primary-yellow-500': '#898769',
        'primary-yellow-600': '#757159',
        'primary-yellow-700': '#5f5a49',
        'primary-yellow-800': '#534e42',
        'primary-yellow-900': '#48433b',
        'primary-yellow-950': '#282420',
        'secondary-yellow-50': '#fff9db',
        'secondary-yellow-100': '#fff6c0',
        'secondary-yellow-200': '#ffeb85',
        'secondary-yellow-300': '#ffd73f',
        'secondary-yellow-400': '#ffc00b',
        'secondary-yellow-500': '#f4a600',
        'secondary-yellow-600': '#d37d00',
        'secondary-yellow-700': '#a85600',
        'secondary-yellow-800': '#8a4309',
        'secondary-yellow-900': '#75370e',
        'secondary-yellow-950': '#451b03',
        'primary-purple-50': '#f6f5f9',
        'primary-purple-100': '#eae8f1',
        'primary-purple-200': '#d9d6e7',
        'primary-purple-300': '#bfb9d7',
        'primary-purple-400': '#a097c3',
        'primary-purple-500': '#8d7eb3',
        'primary-purple-600': '#7f6ca4',
        'primary-purple-700': '#756095',
        'primary-purple-800': '#63527b',
        'primary-purple-900': '#504462',
        'primary-purple-950': '#342d3e',
        'secondary-purple-50': '#fbf5ff',
        'secondary-purple-100': '#f6ebff',
        'secondary-purple-200': '#ecd5ff',
        'secondary-purple-300': '#ddb4fe',
        'secondary-purple-400': '#c984fc',
        'secondary-purple-500': '#b455f7',
        'secondary-purple-600': '#a033ea',
        'secondary-purple-700': '#8a22ce',
        'secondary-purple-800': '#7521a8',
        'secondary-purple-900': '#601c87',
        'secondary-purple-950': '#420764'
      }
    }
  },
  plugins: []
};
