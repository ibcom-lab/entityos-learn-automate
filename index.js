/*
	See:
	https://learn-next.entityos.cloud/learn-function-automation

	This is node app to automate tasks
	https://www.npmjs.com/package/lambda-local:

	lambda-local -l index.js -t 9000 -e event-0000-xxx.json
*/

exports.handler = function (event, context, callback)
{
	var entityos = require('entityos')
	var _ = require('lodash')
	var moment = require('moment');

	entityos.set(
	{
		scope: '_event',
		value: event
	});

	//Event: {"site": "0000"}

	entityos.set(
	{
		scope: '_context',
		value: context
	});

	entityos.set(
	{
		scope: '_callback',
		value: callback
	});

	var settings;

	if (event != undefined)
	{
		if (event.site != undefined)
		{
			settings = event.site;
			//ie use settings-[event.site].json
		}
		else
		{
			settings = event;
		}
	}

	entityos._util.message(
	[
		'-',
		'EVENT-SETTINGS:',
		settings
	]);

	entityos.init(main, settings)
	entityos._util.message('Using entityos module version ' + entityos.VERSION);
	
	function main(err, data)
	{
		var settings = entityos.get({scope: '_settings'});
		var event = entityos.get({scope: '_event'});

		entityos._util.message(
		[
			'-',
			'SETTINGS:',
			settings
		]);

		var namespace = settings.automate.namespace;

		if (event.namespace != undefined)
		{
			namespace = event.namespace;
		}

		if (namespace != undefined)
		{
			entityos._util.message(
			[
				'-',
				'NAMESPACE:',
				namespace
			]);

			var automatefactory = require('./automatefactory.' + namespace + '.js');
		}
		
		if (_.has(automatefactory, 'init'))
		{
			automatefactory.init();
		}
		
		entityos.add(
		{
			name: 'util-log',
			code: function (data)
			{
				entityos.cloud.save(
				{
					object: 'core_debug_log',
					data: data
				});
			}
		});

		entityos.add(
		{
			name: 'util-end',
			code: function (data, error)
			{
				var callback = entityos.get(
				{
					scope: '_callback'
				});

				if (error == undefined) {error = null}

				if (callback != undefined)
				{
					callback(error, data);
				}
			}
		});

		/* STARTS HERE! */

		var event = entityos.get({scope: '_event'});

		var controller = event.controller;
		if (controller == undefined)
		{
			controller = 'automate-start'
		}

		entityos.invoke(controller);
	}
}