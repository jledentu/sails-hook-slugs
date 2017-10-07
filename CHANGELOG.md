# Change Log

## [3.0.0] - 2017-10-08
### Added
Add property `separator` in `sails.config.slugs` to specify separator to use in slugs.
### Changed
- Replace slug by slugg
- Indicate code coverage

## [2.1.0] - 2017-03-29
### Added
Add property `blacklist` in `sails.config.slugs` and model attributes to exclude names from slugs.
### Changed
- Replace node-uuid by uuid
- Remove require-all and Lodash dependencies
- Replace JSCS + JSHint linters by ESLint

## [2.0.0] - 2017-03-19
### Changed
When a slug already exists, a dash is added between the slug and the UUID (thanks @thibaultboursier).

## [1.0.0] - 2015-12-06
### Added
Add configuration in `sails.config.slugs`:
- `lowercase` (`boolean`) to lowercase slugs (defaults to `true`)
### Changed
Slugs are lowercased and not capitalized anymore by default.

## [0.2.6] - 2015-12-04
### Fixed
- Add `.npmignore`
- Fix missing dependencies
- Fix an issue with attribute property `from`

## [0.2.0] - 2015-12-03
### Added
Resolve slug conflicts by adding a UUID after a new slug if already exists

## [0.1.0] - 2015-11-30
Initial version
### Added
- Slug generation
- Base configuration