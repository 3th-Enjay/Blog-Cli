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
    userName = await askQuestion('Please enter your name: ');
    console.log(chalk.green('Saved successfully!\n'));
  }
  
  console.log(`Hello, ${chalk.bold(userName)}! Choose an option:`);
  console.log('1. Create Post');
  console.log('2. View Posts');
  console.log('3. Update Post');
  console.log('4. Delete Post');
  console.log('5. Exit');
  
  const choice = await askQuestion('Select an option (1-5): ');
  
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
