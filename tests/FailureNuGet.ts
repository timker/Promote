import {TaskMockRunner} from 'azure-pipelines-task-lib/mock-run';
import {TaskLibAnswers} from "azure-pipelines-task-lib/mock-answer";
import * as nock from 'nock';
import * as path from 'path';

let taskPath = path.join(__dirname, '../src', 'Task.js');
let tmr: TaskMockRunner = new TaskMockRunner(taskPath);

let answers: TaskLibAnswers = {
    checkPath: {
        "c:\\workspace\\artifact\\package.1.2.0.10000.nupkg":true
    }
};

tmr.setAnswers(answers);

tmr.setInput('feed', 'feed-id');
tmr.setInput('view', 'view-id');
tmr.setInput('package', "c:\\workspace\\artifact\\package.1.2.0.10000.nupkg");
process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "https://abc.visualstudio.com/";
process.env['ENDPOINT_AUTH_SYSTEMVSSCONNECTION'] = "{\"parameters\":{\"AccessToken\":\"token\"},\"scheme\":\"OAuth\"}";

nock('https://feeds.dev.azure.com',
    {
        reqheaders:{
            "user-agent": "haplo-promote"
        }
    })
    .patch('/abc/_apis/packaging/feeds/feed-id/nuget/packages/package/versions/1.2.0.10000?api-version=5.0-preview.1')
    .reply(401);

tmr.run();