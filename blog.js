import fs from 'fs/promises';
import readline from 'readline';
import chalk from 'chalk';

const FILE_PATH = './data/posts.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function loadPosts() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const posts = JSON.parse(data);
    return posts;
  } catch (error) {
    return [];
  }
}

async function savePosts(posts) {
  const jsonData = JSON.stringify(posts, null, 2);
  await fs.writeFile(FILE_PATH, jsonData);
}

export async function createPost(userName) {
  console.log(`\n${chalk.blue('Enter your post content (press Enter to save):')}`);
  const content = await askQuestion('> ');

  const posts = await loadPosts();
  const newPost = {
    id: Date.now(),
    user: userName,
    content: content,
  };
  posts.push(newPost);
  await savePosts(posts);

  console.log(chalk.green('Post created successfully!'));
}

export async function viewPosts(userName) {
  const posts = await loadPosts();
  const userPosts = posts.filter(post => post.user.toLowerCase() === userName.toLowerCase());

  if (userPosts.length === 0) {
    console.log(chalk.yellow(`No posts found for user: ${chalk.bold(userName)}`));
  } else {
    console.log(chalk.blue(`\nPosts by ${chalk.bold(userName)}:`));
    userPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${chalk.bold(post.content)} (ID: ${post.id})`);
    });
  }
}

export async function updatePost(userName) {
  const posts = await loadPosts();
  const userPosts = posts.filter((post) => {
    return post.user === userName;
  });

  if (userPosts.length === 0) {
    console.log(chalk.yellow('No posts to update.'));
    return;
  }

  console.log(chalk.blue(`\nSelect a post to update:`));
  for (let index = 0; index < userPosts.length; index++) {
    const post = userPosts[index];
    console.log(`${index + 1}. ${post.content} (ID: ${post.id})`);
  }

  const choice = await askQuestion('Enter the number of the post to update: ');
  const postIndex = parseInt(choice, 10) - 1;

  if (postIndex >= 0 && postIndex < userPosts.length) {
    const newContent = await askQuestion('Enter new content: ');
    userPosts[postIndex].content = newContent;
    await savePosts(posts);
    console.log(chalk.green('Post updated successfully!'));
  } else {
    console.log(chalk.red('Invalid post number.'));
  }
}

export async function deletePost(userName) {
  const posts = await loadPosts();
  const userPosts = posts.filter((post) => {
    return post.user === userName;
  });

  if (userPosts.length === 0) {
    console.log(chalk.yellow('No posts to delete.'));
    return;
  }

  console.log(chalk.blue(`\nSelect a post to delete:`));
  for (let index = 0; index < userPosts.length; index++) {
    const post = userPosts[index];
    console.log(`${index + 1}. ${post.content} (ID: ${post.id})`);
  }

  const choice = await askQuestion('Enter the number of the post to delete: ');
  const postIndex = parseInt(choice, 10) - 1;

  if (postIndex >= 0 && postIndex < userPosts.length) {
    const postToDelete = userPosts[postIndex];
    const updatedPosts = posts.filter((post) => {
      return post.id !== postToDelete.id;
    });
    await savePosts(updatedPosts);
    console.log(chalk.green('Post deleted successfully!'));
  } else {
    console.log(chalk.red('Invalid post number.'));
  }
}
