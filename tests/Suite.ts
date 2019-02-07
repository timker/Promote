import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Task tests', function () {
    it('NuGet Package success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessNuGet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('NuGet Package failure', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'FailureNuGet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have no errors");
        assert.equal(tr.errorIssues[0], 'Organization name could not be found.', 'error issue output');
        done();
    });

    it('Feed input not set', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailureFeedInputNotSet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: feed', 'error issue output');

        done();
    });

    it('View input not set', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailureViewInputNotSet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: view', 'error issue output');

        done();
    });

    it('Package path input not set', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailurePackagePathInputNotSet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: package', 'error issue output');

        done();
    });

    it('System team foundation collection uri not set', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailureSystemTeamFoundationCollectionUriNotSet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'SYSTEM_TEAMFOUNDATIONCOLLECTIONURI is not set', 'error issue output');

        done();
    });
});