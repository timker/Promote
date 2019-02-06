import {TaskMockRunner} from 'azure-pipelines-task-lib/mock-run';
import {TaskLibAnswers} from "azure-pipelines-task-lib/mock-answer";
import * as nock from 'nock';
import * as path from 'path';

let taskPath = path.join(__dirname, '../scripts/', 'Task.js');
let tmr: TaskMockRunner = new TaskMockRunner(taskPath);

let answers: TaskLibAnswers = {
    checkPath: {
        "c:\\workspace\\artifact\\package.nuget.1.2.0.10000.nupkg":true
    }
};

tmr.setAnswers(answers);

tmr.setInput('feed', 'feed-id');
tmr.setInput('view', 'view-id');
tmr.setInput('package', "c:\\workspace\\artifact\\package.nuget.1.2.0.10000.nupkg");
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "https://dev.visualstudio.com/abc/";
process.env['ENDPOINT_AUTH_SYSTEMVSSCONNECTION'] = "{\"parameters\":{\"AccessToken\":\"token\"},\"scheme\":\"OAuth\"}";

nock('https://pkgs.dev.azure.com',
    {
        reqheaders:{
            "user-agent": "haplo-promote"
        }
    })
    .patch('/abc/_apis/packaging/feeds/feed-id/nuget/packages/package.nuget/versions/1.2.0.10000?api-version=5.0-preview.1')
    .reply(200);

tmr.run();