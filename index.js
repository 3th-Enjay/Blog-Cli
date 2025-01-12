import readline from 'readline';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { createPost, viewPosts, updatePost, deletePost } from './blog.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let userName = '';

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function displayTitle() {
  console.clear();
  console.log(gradient.rainbow('='.repeat(40)));
  console.log(gradient.rainbow('     WELCOME TO NELSON BLOG CLI     '));
  console.log(gradient.rainbow('='.repeat(40)));
}

async function mainMenu() {
  await displayTitle();
  if (!userName) {
    userName = await askQuestion(chalk.blue('Please enter your name: '));
    console.log(chalk.green('\nSaved successfully!\n'));
  }
  
  console.log(chalk.white(`Hello, ${chalk.bold.yellow(userName)}! Choose an option:\n`));
  console.log(chalk.blue('1.') + chalk.white(' Create Post'));
  console.log(chalk.blue('2.') + chalk.white(' View Posts'));
  console.log(chalk.blue('3.') + chalk.white(' Update Post'));
  console.log(chalk.blue('4.') + chalk.white(' Delete Post'));
  console.log(chalk.blue('5.') + chalk.white(' Exit\n'));

  const choice = await askQuestion(chalk.blue("select an option from 1-5 "))
  
  if (choice === '1') {
    await createPost(userName);
  } else if (choice === '2') {
    await viewPosts(userName);
  } else if (choice === '3') {
    await updatePost(userName);
  } else if (choice === '4') {
    await deletePost(userName);
  } else if (choice === '5') {
    console.log(chalk.blue('Goodbye!'));
    rl.close();
    return;
  } else {
    console.log(chalk.red('Invalid choice. Please enter a number between 1 and 5.'));
  }
  
  await mainMenu();
}

mainMenu();
