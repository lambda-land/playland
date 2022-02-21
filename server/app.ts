import * as path from 'path';
import * as os from 'os';

import { promisify } from 'util';
import { spawn, exec as _exec, ChildProcess, spawnSync } from 'child_process';
const exec = promisify(_exec);

import { writeFile, rm, rmdir, mkdtemp, readFile } from 'fs/promises';

import * as express from 'express';
import * as e from 'express';
import { rmdirSync, rmSync } from 'fs';
const app = express();
const port = 9000 || process.env.PORT;

const elm_config = require('./elm-config.json');

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
type EvaluationPackage = {
    language: 'elm' | 'bogl';
    source: string;
    expression: string;
};

const run = async ({ source, expression }: EvaluationPackage, folder: string) => {

    const contents = `module Program exposing (..)\n${source}\nexpr=${expression}\n`;
    await writeFile(path.join(folder, 'Program.elm'), contents);
    await writeFile(path.join(folder, 'elm.json'), JSON.stringify(elm_config));
    // console.log(contents)
    const elmProcess = spawn('elm', ['repl', '--no-colors'], { cwd: folder, shell: true });

    const output: string[] = [];
    const instructions = [...[
        // ':reset',
        '2 + 2',
        'import Program exposing (..)',
        // contents,
        expression,  
    ].map(inst => inst + '\n'),expression];
    // elmProcess.stderr.on('data', data => {
    //     console.error('Elm Error: ', data.toString());
    // });
    let error : null | string = null;

    let done = false;
    const code = await new Promise((res,rej) => {
        elmProcess.stderr.on('data', data => {
            if (done) { res(0); return; }

            console.error('[elm.stderr.buffer]', elmProcess.stderr.toString());
            error = data.toString('utf8');
            console.error('[elm.stderr]', error);

            setTimeout(() => {
                elmProcess.stdin.end();
                elmProcess.kill();
                console.info('(killed)', path.join(folder, 'Program.elm'));
                setTimeout( function () {
                    rmSync(folder,{recursive:true,force:true});
                    console.info('(removed)', folder);
                },10);
            },1000);
            done = true;

            res(0);
        });
        elmProcess.stdout.on('data', data => {
            if (done) { res(0); return; }

            const dat = data.toString();
            output.push(dat);
            console.log('[elm.stdio]', dat);

            // Feed in instructions until it's consumed then kill thread. 
            if (instructions.length > 0) {
                const next = instructions.shift();
                elmProcess.stdin.write(next);
            } else {
                // elmProcess.stdin.end();
                // elmProcess.kill();
                // console.warn('killed');
                setTimeout(() => {
                    elmProcess.stdin.end();
                    elmProcess.kill();
                    console.info('(killed)', path.join(folder, 'Program.elm'));
                    setTimeout( function () {
                        rmSync(folder,{recursive:true,force:true});
                        console.info('(removed)', folder);
                    },10);
                },10);
                done = true;
            }
        });
    });


    // const writes = instructions.map(inst => new Promise(
    //     (res,rej) => elmProcess.stdin.write(inst + '\n', res)));
    // for (const write of writes) {
    //     await write;
    // }
    // const writes = instructions.map(inst => elmProcess.stdin.write(inst));

    // for (const inst of instructions) {
    //     await new Promise((res,rej) => {
    //         elmProcess.stdin.write(inst + '\n', () => {
    //             console.log('written', inst);
    //             res(null);
    //         });
    //     });
    // }

    // elmProcess.stdin.end();
    // elmProcess.kill();
    // const exitCode = await new Promise((resolve,reject) => {
    //     elmProcess.on('close', resolve);
    //     elmProcess.kill('SIGINT');
    // })
    // await rmdir(folder, { recursive: true });
    // })
    // elmProcess.stdin.end();
    // elmProcess.kill();

    // console.log(output, 'exit code:', exitCode);
    if (error == null) {
        const ret = `${output[output.length-1]}`.trim();
        console.info('(output-success)', ret);
        return { 'evaluated' : ret };
    } else {
        console.error('(output-error)', error);
        return { 'error' : error };
    }
    
};

const resources = new Map<string,string>();

app.post('/', async (request, response) => {
    const { 'body': pkg }: { 'body': EvaluationPackage } = request;
    const { ip }: { ip: string } = request;

    // const resourcePath = resources.get(ip) || await mkdtemp(path.join(os.tmpdir(), `e-elm-sesh`));
    // resources.set(ip,resourcePath);
    const resourcePath = await mkdtemp(path.join(os.tmpdir()));
    resources.set(ip,resourcePath);

    // console.log('Request:', request.ip, resourcePath, pkg);
    console.info('(input)', pkg.expression);

    const output = await run(pkg, resourcePath);
    response.json({ ...output });
    // response.json({ evaluated: output });
    // setTimeout((function () {
    //     const rmrf = spawn('rm', ['-rf', resourcePath]);
    //     rmrf.stdin.end();
    //     rmrf.kill();
    //     console.log('Removed', resourcePath);
    // }).bind(resourcePath),20);
    
});

// async function test() {
//     const pkg: EvaluationPackage = {
//         language: 'elm',
//         source: (await readFile('./TestSource.elm')).toString(),
//         expression: '1 + h'
//     };
//     const ip = '6969696';

//     // const resourcePath = resources.get(ip) || await mkdtemp(path.join(os.tmpdir(), `playland-${ip}-`));
//     // resources.set(ip,resourcePath);
//     const resourcePath = await mkdtemp(path.join(os.tmpdir()));
//     resources.set(ip,resourcePath);

//     const output = await run(pkg, resourcePath);
//     console.log(output);
// }

// test();

app.get('/', async (request, response) => {
    response.json({ message: 'Hello!' });
})

app.listen(port, () => console.log('Listening on', port));

