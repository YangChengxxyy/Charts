import { defineConfig } from '@umijs/max';

export default defineConfig({
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://yangchengxxyy.github.io/Charts/'
      : '/',
  history: {
    type: 'hash',
  },
  hash: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '绘制',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '桑吉图绘制',
      path: '/sankey',
      component: './SankeyCharts',
    },
  ],
  npmClient: 'pnpm',
});


