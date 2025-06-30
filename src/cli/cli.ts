import { interactiveCreate } from '../commands/create'
import { showNextSteps } from '../utils/helpers'
import { Command } from 'commander'
import { version } from '../../package.json'

const program = new Command()

program
  .name('create-llama')
  .description('Create LlamaIndex projects with the CLI')
  .version(version)
  .argument('[project-directory]', 'The name of the application', '.')
  .option(
    '-t, --template [name]',
    'Use a LlamaIndex template. Official templates: [nextjs-ts, streamlit, flask]. Custom templates: [gh:owner/repo]'
  )
  .option(
    '-pm, --package-manager <npm|yarn|pnpm>',
    'Use a specific package manager. Defaults to npm.'
  )
  .option(
    '-d, --no-install',
    'Skip installing dependencies. Useful for quick scaffolding.'
  )
  .option(
    '-git, --no-git',
    'Skip initializing a git repository. Useful for quick scaffolding.'
  )
  .action(async (projectName, options) => {
    const config = await interactiveCreate(projectName)
    showNextSteps(config)
  })

program.parse()
