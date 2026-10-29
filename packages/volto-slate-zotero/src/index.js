import installPlugins from './plugins';

const applyConfig = (config) => {
  installPlugins(config);
  return config;
};

export default applyConfig;
