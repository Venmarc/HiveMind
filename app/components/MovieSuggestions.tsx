"use client";
import React, { useEffect, useState } from 'react';
import { tmdbFetch } from '../lib/tmdb';

interface Movie {
    id: number;
    title: string;
    release_date: string;
    poster_path: string | null;
    overview: string;
    vote_average?: number;
}

interface MovieSuggestionsProps {
    onAddOption: (option: { id: string; title: string; desc: string; image?: string | null }) => void;
}

export const MovieSuggestions: React.FC<MovieSuggestionsProps> = ({ onAddOption }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = () => {
        setLoading(true);
        tmdbFetch('/trending/movie/week')
            .then(data => {
                setMovies(data.results.slice(0, 10));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            fetchTrending();
            return;
        }

        setLoading(true);
        tmdbFetch('/search/movie', { query })
            .then(data => {
                setMovies(data.results.slice(0, 10));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    if (loading && movies.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 bg-gray-900/30 rounded-2xl border border-white/5 animate-pulse">
                <div className="text-yellow-400 font-mono tracking-widest uppercase text-xs">Scanning TMDB Database...</div>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
                    Movie Suggestions
                </h2>
                <input
                    type="text"
                    placeholder="Search for a specific title..."
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 w-64 transition-all"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className="group flex flex-col bg-gray-900/40 rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-yellow-500/50 transition-all duration-300"
                        onClick={() => onAddOption({
                            id: `tmdb-${movie.id}`,
                            title: movie.title,
                            desc: movie.overview?.slice(0, 100) + (movie.overview?.length > 100 ? '...' : ''),
                            image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                        })}
                    >
                        <div className="w-full aspect-[2/3] bg-black/60 relative overflow-hidden flex-shrink-0">
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 font-mono text-[10px] uppercase p-4 text-center">
                                    <span>No Poster</span>
                                </div>
                            )}

                            {/* Hover overlay for 'Add to Hub' */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-[2px]">
                                <span className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    Add to Hub
                                </span>
                            </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-start">
                            <h3 className="font-bold text-xs text-white line-clamp-1 group-hover:text-yellow-400 transition-colors" title={movie.title}>
                                {movie.title}
                            </h3>
                            <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400 font-mono">
                                <span>{movie.release_date?.slice(0, 4) || 'N/A'}</span>
                                {movie.vote_average ? (
                                    <span className="flex items-center gap-1 text-yellow-500/90 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                        ★ {movie.vote_average.toFixed(1)}
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                {movie.overview || "No synopsis available."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {movies.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 text-sm font-mono italic">
                    No matches found in the sector.
                </div>
            )}
        </div>
    );
};
