import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Task tests', function () {
    it('NuGet package path contains wild card success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessWildCardPathNuGet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('NuGet package path does not contain wild card success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessWithoutWildCardPathNuGet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('NuGet package path contains multiple wild card success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessWildCardMultiplePackagesPathNuGet.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 1, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('NPM package path contains wild card success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessWildCardPathNpm.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        done();
    });

    it('Python package path contains wild card success', (done: MochaDone) => {
        this.timeout(1000);

        let tp = path.join(__dirname, 'SuccessWildCardPathPython.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
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

    it('Package path does not contain a package', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailurePackagePathDoesNotContainPackage.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], '[!] Invalid filename null', 'error issue output');

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

    it('Feed type is not supported', (done: MochaDone) => {
        this.timeout(1000);
        let tp = path.join(__dirname, 'FailureFeedTypeIsNotSupported.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Feed type:upack is not supported', 'error issue output');

        done();
    });
});