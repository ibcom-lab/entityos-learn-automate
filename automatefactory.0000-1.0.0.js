/*
	Automate factory example
*/

var entityos = require('entityos')
var _ = require('lodash')
var moment = require('moment');

module.exports = 
{
	VERSION: '0.0.0',

	init: function (param)
	{
		entityos.add(
		{
			name: 'automate-start',
			code: function (param)
			{
				entityos.invoke('automate-xxx')
			}
		});

		entityos.add(
		{
			name: 'automate-complete',
			code: function (param, response)
			{
				var summary =
				{
					xxx: 'yyyy'
				};

				entityos.invoke('util-end', summary)
			}
		});
	}
}