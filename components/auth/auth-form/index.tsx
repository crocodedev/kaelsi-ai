import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useAppDispatch } from '@/store';
import actions from '@/store/slices/user/actions';
import { astroApiService } from '@/lib/services/astro-api';
import { Section } from '@/components/layouts/section';
import { authActions } from '@/store';
import { LoginData, RegistrationData } from '@/lib/types/astro-api';
import { authService } from '@/lib/services';
import { SocialProviders } from '@/lib/types/configurations';

interface AuthFormProps {
    onSuccess?: () => void;
    className?: string;
}

export function AuthForm({ onSuccess, className }: AuthFormProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { loginWithGoogle } = useSocialAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isLogin) {
                const { data: { access_token, user } } = await astroApiService.login({
                    email: formData.email,
                    password: formData.password
                });

                dispatch(authActions.setToken(access_token));
                dispatch(actions.setUserData(user));
            } else {
                const { data: { access_token, user } } = await astroApiService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                    gender: 'male'
                });

                dispatch(authActions.setToken(access_token));
                dispatch(actions.setUserData(user));
            }

            onSuccess?.();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Authentication failed';
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const result = await loginWithGoogle();

            if (result.serverAuthCode) {


                const { data: { access_token, user } } = await authService.loginWithSocial(SocialProviders.GOOGLE, result.serverAuthCode || '')

                if (access_token) {
                    dispatch(authActions.setToken(access_token))
                    dispatch(actions.setUserData(user))
                }
            }


            onSuccess?.();

        } catch (error: any) {
            setErrors({ general: 'Google login failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Section className={`w-full max-w-[90%] mx-auto ${className}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <Input
                            label="Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                        )}
                    </div>
                )}

                <div>
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                    )}
                </div>

                <div>
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                    )}
                </div>

                {!isLogin && (
                    <div>
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                        )}
                    </div>
                )}

                {errors.general && (
                    <div className="text-red-500 text-sm text-center">
                        {errors.general}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
            </form>

            <div className="mt-6">

                <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full mt-4"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5 mr-2"
                    />
                    Google
                </Button>
            </div>

            <div className="mt-6 text-center">
                <Button
                    variant="outline"
                    onClick={() => setIsLogin(!isLogin)}
                    className='w-full'
                >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
            </div>
        </Section>
    );
} 