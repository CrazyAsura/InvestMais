import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogService } from '../../monitoring/activity-log/activity-log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly activityLogService: ActivityLogService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { user, method, path, ip, body, headers } = request;

        return next.handle().pipe(
            tap(async () => {
                if (user) {
                    await this.activityLogService.create({
                        userId: user.sub || user._id,
                        userName: user.name || user.email, // Dependendo de como o payload do JWT é estruturado
                        userEmail: user.email,
                        userRole: user.role,
                        action: this.getActionName(method, path),
                        method,
                        path,
                        ip: ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress,
                        userAgent: headers['user-agent'],
                        details: this.sanitizeBody(body),
                    });
                }
            }),
        );
    }

    private getActionName(method: string, path: string): string {
        // Mapeamento simples de ações baseado no método e caminho
        if (path.includes('auth/login')) return 'Login';
        if (path.includes('auth/register')) return 'Registro';
        if (path.includes('auth/logout')) return 'Logout';
        
        const resource = path.split('/')[1] || 'unknown';
        
        switch (method) {
            case 'POST': return `Criar ${resource}`;
            case 'GET': return `Listar/Ver ${resource}`;
            case 'PUT':
            case 'PATCH': return `Atualizar ${resource}`;
            case 'DELETE': return `Deletar ${resource}`;
            default: return `${method} ${path}`;
        }
    }

    private sanitizeBody(body: any): any {
        if (!body) return null;
        const sanitized = { ...body };
        // Remover campos sensíveis
        const sensitiveFields = ['password', 'token', 'oldPassword', 'newPassword'];
        sensitiveFields.forEach(field => {
            if (field in sanitized) {
                sanitized[field] = '********';
            }
        });
        return sanitized;
    }
}
