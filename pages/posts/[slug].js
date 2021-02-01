import Image from 'next/image';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Aside from '../../components/Aside';
import Main from '../../components/Main';
import BlogDate from '../../components/BlogDate';
import { getAllPosts, getPostBySlug } from '../../utils/api';
import markdownToHtml from '../../utils/markdownToHtml';
import styles from '../../components/markdown-styles.module.css';

export default function Post({ post }) {
	return (
		<Container>
			<Header />
			<Main>
				<header>
					<h1 className="mb-7 mt-14 text-5xl font-black font-sans">
						{post.title}
					</h1>
					<p className="leading-7 mb-7 -mt-6">
						<BlogDate date={post.date} minutes={4} />
					</p>
				</header>
				<Image
					src={post.coverImage}
					alt={`Cover image for ${post.title}`}
					layout="responsive"
					width={1240}
					height={620}
				/>
				<article
					className={styles.markdown}
					dangerouslySetInnerHTML={{ __html: post.content }}
				></article>
			</Main>
			<Aside />
		</Container>
	);
}

export async function getStaticProps({ params }) {
	const post = getPostBySlug(params.slug, [
		'title',
		'excerpt',
		'date',
		'slug',
		'coverImage',
		'content'
	]);
	const content = await markdownToHtml(post.content || '');

	return {
		props: {
			post: {
				...post,
				content
			}
		}
	};
}

export async function getStaticPaths() {
	const posts = getAllPosts(['slug']);

	return {
		paths: posts.map((post) => {
			return {
				params: {
					slug: post.slug
				}
			};
		}),
		fallback: false
	};
}
