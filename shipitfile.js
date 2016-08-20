module.exports = function(shipit) {
    require('shipit-deploy')(shipit);

    const deployToPath = '/usr/src/pepo-api';
    const deployToCurentPath = deployToPath + '/current';

    shipit.initConfig({
        default: {
            workspace: '/tmp/pepo-api-workspace',
            deployTo: deployToPath,
            repositoryUrl: 'https://github.com/shri-team5/pepo-api.git',
            ignores: ['.git', 'node_modules'],
            keepReleases: 3
        },
        production: {
            servers: 'root@188.166.17.158'
        }
    });

    shipit.on('published', function() {
        shipit.start('stop');
        shipit.start('start');
    });

    shipit.task('start', function() {
        return shipit.remote(`cd ${deployToCurentPath} && npm install && PORT=8080 npm start`);
    });

    shipit.task('stop', function() {
        return shipit.remote(`cd ${deployToCurentPath} && npm run stop`);
    });
};
