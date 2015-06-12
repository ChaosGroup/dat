'use strict';

const expect = require('./testSetup');
const defaultConnectionSetup = require('./dbsetupandteardown');
const _ = require('lodash');

const db = require('./dbinit');
const AccessTree = db.AccessTree;
const Users = require('./Users');

const AccessTreeGrants = db.sequelize.models.AccessTreeGrant;
const treeSetup = require('./treeSetup');

describe('Access Tree with example model', function () {
	defaultConnectionSetup();

	let nodes;

	beforeEach(function* () {
		nodes = yield treeSetup(AccessTree, AccessTreeGrants);
	});

	it('can get all the nodes', function* () {
		let result = yield AccessTree.scope('withgrants').findAll();
		expect(result).to.be.an('array').with.length(Object.keys(nodes).length);
		expect(_.map(result, 'id')).to.have.members(_.map(nodes, 'id'));
	});

	it('has grant to peter for role manager', function* () {
		let alpha = yield AccessTree.scope('withgrants').findById(nodes.alpha.id);

		expect(alpha.AccessTreeGrants).to.be.an('array').with.length(1);

		let aGrant = alpha.AccessTreeGrants[0];
		expect(aGrant).to.have.property('UserId', Users.peter);
		expect(aGrant).to.have.property('role', 'manager');
	});

	it('returns all grants for object with multiple grants', function* () {
		let betaSalesAmericas = yield AccessTree.scope('withgrants').findById(nodes.betaSalesAmericas.id);
		let grants = betaSalesAmericas.AccessTreeGrants;
		expect(grants).to.be.an('array').with.length(2);
	});
});
