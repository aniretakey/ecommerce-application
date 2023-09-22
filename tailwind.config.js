/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#518581',
          secondary: '#FFB23F',
          accent: '#e11d48',
          neutral: '#AD7E5C',
          'base-100': '#F9F9F9',
          info: '#F3F3F3',
          success: '#bef264',
          warning: '#fde047',
          error: '#f87171',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
